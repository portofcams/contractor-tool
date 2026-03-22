import Foundation
import Capacitor

#if canImport(RoomPlan)
import RoomPlan
#endif

/// Capacitor plugin that wraps Apple's RoomPlan API for LiDAR room scanning.
/// Requires iOS 16+ and a LiDAR-equipped device (iPhone 12 Pro+, iPad Pro 2020+).
@objc(RoomScannerPlugin)
public class RoomScannerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "RoomScannerPlugin"
    public let jsName = "RoomScanner"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startScan", returnType: CAPPluginReturnPromise),
    ]

    private var savedCall: CAPPluginCall?

    @objc func isAvailable(_ call: CAPPluginCall) {
        #if canImport(RoomPlan)
        if #available(iOS 16.0, *) {
            call.resolve(["available": RoomCaptureSession.isSupported])
        } else {
            call.resolve(["available": false])
        }
        #else
        call.resolve(["available": false])
        #endif
    }

    @objc func startScan(_ call: CAPPluginCall) {
        #if canImport(RoomPlan)
        if #available(iOS 16.0, *) {
            guard RoomCaptureSession.isSupported else {
                call.reject("LiDAR scanner not available on this device")
                return
            }
            savedCall = call
            call.keepAlive = true
            DispatchQueue.main.async { [weak self] in
                guard let self = self else {
                    call.reject("Plugin deallocated")
                    return
                }
                self.presentScanner()
            }
        } else {
            call.reject("Requires iOS 16 or later")
        }
        #else
        call.reject("RoomPlan framework not available")
        #endif
    }

    @available(iOS 16.0, *)
    private func presentScanner() {
        #if canImport(RoomPlan)
        guard let vc = bridge?.viewController else {
            savedCall?.reject("No view controller available")
            savedCall = nil
            return
        }
        let scanVC = RoomScanViewController()
        scanVC.modalPresentationStyle = .fullScreen
        scanVC.onComplete = { [weak self] result in
            self?.handleScanResult(result)
        }
        scanVC.onCancel = { [weak self] in
            self?.savedCall?.reject("Scan cancelled by user")
            self?.savedCall = nil
        }
        scanVC.onError = { [weak self] message in
            self?.savedCall?.reject(message)
            self?.savedCall = nil
        }
        vc.present(scanVC, animated: true)
        #endif
    }

    // MARK: - Process scan result with confidence data

    @available(iOS 16.0, *)
    private func handleScanResult(_ room: CapturedRoom) {
        #if canImport(RoomPlan)
        let metersToFeet = 3.28084
        var rooms: [[String: Any]] = []
        var totalConfidenceScore: Double = 0.0
        var surfaceCount: Int = 0

        // Analyze walls
        var wallDetails: [[String: Any]] = []
        for (i, wall) in room.walls.enumerated() {
            let dims = wall.dimensions
            let lengthFt = Double(dims.x) * metersToFeet
            let heightFt = Double(dims.y) * metersToFeet
            var confidence = "high"
            var accuracyInches = 0.5

            if #available(iOS 17.0, *) {
                if wall.category == .wall {
                    confidence = "high"; accuracyInches = 0.5; totalConfidenceScore += 1.0
                } else {
                    confidence = "medium"; accuracyInches = 1.5; totalConfidenceScore += 0.7
                }
            } else {
                if lengthFt < 2.0 || lengthFt > 30.0 {
                    confidence = "low"; accuracyInches = 3.0; totalConfidenceScore += 0.4
                } else if heightFt < 6.0 || heightFt > 14.0 {
                    confidence = "medium"; accuracyInches = 2.0; totalConfidenceScore += 0.6
                } else {
                    confidence = "high"; accuracyInches = 1.0; totalConfidenceScore += 0.9
                }
            }
            surfaceCount += 1
            wallDetails.append([
                "index": i,
                "lengthFt": round(lengthFt * 100.0) / 100.0,
                "heightFt": round(heightFt * 100.0) / 100.0,
                "confidence": confidence,
                "accuracyInches": accuracyInches,
                "areaFt": round(lengthFt * heightFt * 100.0) / 100.0,
            ])
        }

        var doorDetails: [[String: Any]] = []
        for (i, door) in room.doors.enumerated() {
            let dims = door.dimensions
            doorDetails.append([
                "index": i,
                "widthFt": round(Double(dims.x) * metersToFeet * 100.0) / 100.0,
                "heightFt": round(Double(dims.y) * metersToFeet * 100.0) / 100.0,
                "areaFt": round(Double(dims.x) * Double(dims.y) * metersToFeet * metersToFeet * 100.0) / 100.0,
            ])
        }

        var windowDetails: [[String: Any]] = []
        for (i, window) in room.windows.enumerated() {
            let dims = window.dimensions
            windowDetails.append([
                "index": i,
                "widthFt": round(Double(dims.x) * metersToFeet * 100.0) / 100.0,
                "heightFt": round(Double(dims.y) * metersToFeet * 100.0) / 100.0,
                "areaFt": round(Double(dims.x) * Double(dims.y) * metersToFeet * metersToFeet * 100.0) / 100.0,
            ])
        }

        if #available(iOS 17.0, *) {
            for (index, floor) in room.floors.enumerated() {
                let dims = floor.dimensions
                let length = Double(dims.x) * metersToFeet
                let width = Double(dims.z) * metersToFeet
                let height = findWallHeight(for: floor, in: room) * metersToFeet
                let floorArea = length * width
                let wallArea = 2.0 * (length + width) * height

                var roomConfidence = "high"
                var roomAccuracyPct = 1.0
                var roomAccuracyInches = 0.5

                let maxDim = max(length, width)
                if maxDim > 25.0 {
                    roomConfidence = "low"; roomAccuracyPct = 4.0; roomAccuracyInches = 3.0
                } else if maxDim > 18.0 {
                    roomConfidence = "medium"; roomAccuracyPct = 2.5; roomAccuracyInches = 2.0
                } else if maxDim > 12.0 {
                    roomConfidence = "medium"; roomAccuracyPct = 1.5; roomAccuracyInches = 1.0
                }

                let nearbyWalls = countNearbyWalls(for: floor, in: room)
                if nearbyWalls < 3 {
                    roomConfidence = "low"
                    roomAccuracyPct = max(roomAccuracyPct, 5.0)
                    roomAccuracyInches = max(roomAccuracyInches, 4.0)
                } else if nearbyWalls == 3 && roomConfidence == "high" {
                    roomConfidence = "medium"
                    roomAccuracyPct = max(roomAccuracyPct, 2.0)
                    roomAccuracyInches = max(roomAccuracyInches, 1.5)
                }

                rooms.append([
                    "name": "Room \(index + 1)",
                    "length": round(length * 10.0) / 10.0,
                    "width": round(width * 10.0) / 10.0,
                    "height": round(height * 10.0) / 10.0,
                    "floorArea": round(floorArea * 10.0) / 10.0,
                    "wallArea": round(wallArea * 10.0) / 10.0,
                    "confidence": roomConfidence,
                    "accuracyPct": roomAccuracyPct,
                    "accuracyInches": roomAccuracyInches,
                    "nearbyWalls": nearbyWalls,
                ])
                totalConfidenceScore += roomConfidence == "high" ? 1.0 : roomConfidence == "medium" ? 0.65 : 0.3
                surfaceCount += 1
            }
        }

        // Fallback: derive from walls
        if rooms.isEmpty && !room.walls.isEmpty {
            let wallHeights = room.walls.map { Double($0.dimensions.y) }
            let avgHeight = (wallHeights.reduce(0, +) / Double(wallHeights.count)) * metersToFeet
            let heightStdDev = standardDeviation(wallHeights) * metersToFeet

            var minX = Double.infinity, maxX = -Double.infinity
            var minZ = Double.infinity, maxZ = -Double.infinity
            for wall in room.walls {
                let pos = wall.transform.columns.3
                let halfW = Double(wall.dimensions.x) / 2.0
                minX = min(minX, Double(pos.x) - halfW)
                maxX = max(maxX, Double(pos.x) + halfW)
                minZ = min(minZ, Double(pos.z) - halfW)
                maxZ = max(maxZ, Double(pos.z) + halfW)
            }

            let length = (maxX - minX) * metersToFeet
            let width = (maxZ - minZ) * metersToFeet

            var roomConfidence = "medium"
            var roomAccuracyPct = 3.0
            var roomAccuracyInches = 2.0
            if room.walls.count >= 4 { roomAccuracyPct = 2.0; roomAccuracyInches = 1.5 }
            if room.walls.count < 3 { roomConfidence = "low"; roomAccuracyPct = 5.0; roomAccuracyInches = 4.0 }
            if heightStdDev > 0.15 { roomConfidence = "low"; roomAccuracyPct = max(roomAccuracyPct, 4.0) }

            rooms.append([
                "name": "Room 1",
                "length": round(length * 10.0) / 10.0,
                "width": round(width * 10.0) / 10.0,
                "height": round(avgHeight * 10.0) / 10.0,
                "floorArea": round(length * width * 10.0) / 10.0,
                "wallArea": round(2.0 * (length + width) * avgHeight * 10.0) / 10.0,
                "confidence": roomConfidence,
                "accuracyPct": roomAccuracyPct,
                "accuracyInches": roomAccuracyInches,
                "nearbyWalls": room.walls.count,
            ])
        }

        if rooms.isEmpty {
            savedCall?.reject("No walls or floors detected. Try scanning slower, pointing at walls and floor.")
            savedCall = nil
            return
        }

        let overallScore = surfaceCount > 0
            ? min(100.0, (totalConfidenceScore / Double(surfaceCount)) * 100.0) : 50.0

        var floorCount = 0
        if #available(iOS 17.0, *) { floorCount = room.floors.count }

        let expectedSurfaces = max(6, room.walls.count + 2)
        let detectedSurfaces = room.walls.count + floorCount
        let coveragePct = min(100.0, (Double(detectedSurfaces) / Double(expectedSurfaces)) * 100.0)

        var usdzBase64: String? = nil
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("room_scan_\(UUID().uuidString).usdz")
        do {
            try room.export(to: tempURL, exportOptions: .model)
            let usdzData = try Data(contentsOf: tempURL)
            usdzBase64 = usdzData.base64EncodedString()
            try? FileManager.default.removeItem(at: tempURL)
        } catch {
            print("USDZ export failed: \(error.localizedDescription)")
        }

        let confidenceSummary: [String: Any] = [
            "overallScore": round(overallScore * 10.0) / 10.0,
            "overallGrade": overallScore >= 80 ? "high" : overallScore >= 55 ? "medium" : "low",
            "coveragePct": round(coveragePct * 10.0) / 10.0,
            "wallDetails": wallDetails,
            "doorDetails": doorDetails,
            "windowDetails": windowDetails,
            "recommendations": buildRecommendations(rooms: rooms, wallDetails: wallDetails, coveragePct: coveragePct, wallCount: room.walls.count),
            "shouldVerify": overallScore < 75,
        ]

        var result: [String: Any] = [
            "rooms": rooms,
            "surfaceCount": room.walls.count + floorCount,
            "wallCount": room.walls.count,
            "floorCount": floorCount,
            "doorCount": room.doors.count,
            "windowCount": room.windows.count,
            "openingCount": room.doors.count + room.windows.count,
            "confidence": confidenceSummary,
        ]
        if let usdz = usdzBase64 { result["usdzBase64"] = usdz }
        savedCall?.resolve(result)
        savedCall = nil
        #endif
    }

    // MARK: - Helpers

    @available(iOS 17.0, *)
    private func findWallHeight(for floor: CapturedRoom.Surface, in room: CapturedRoom) -> Double {
        #if canImport(RoomPlan)
        let floorPos = floor.transform.columns.3
        var bestHeight: Double = 2.44
        var bestDist = Double.infinity
        for wall in room.walls {
            let wallPos = wall.transform.columns.3
            let dx = Double(wallPos.x - floorPos.x)
            let dz = Double(wallPos.z - floorPos.z)
            let dist = sqrt(dx * dx + dz * dz)
            if dist < bestDist { bestDist = dist; bestHeight = Double(wall.dimensions.y) }
        }
        return bestHeight
        #else
        return 2.44
        #endif
    }

    @available(iOS 17.0, *)
    private func countNearbyWalls(for floor: CapturedRoom.Surface, in room: CapturedRoom) -> Int {
        #if canImport(RoomPlan)
        let floorPos = floor.transform.columns.3
        let floorDims = floor.dimensions
        let maxDist = Double(max(floorDims.x, floorDims.z)) * 1.5
        var count = 0
        for wall in room.walls {
            let wallPos = wall.transform.columns.3
            let dx = Double(wallPos.x - floorPos.x)
            let dz = Double(wallPos.z - floorPos.z)
            if sqrt(dx * dx + dz * dz) < maxDist { count += 1 }
        }
        return count
        #else
        return 0
        #endif
    }

    private func standardDeviation(_ values: [Double]) -> Double {
        guard values.count > 1 else { return 0 }
        let mean = values.reduce(0, +) / Double(values.count)
        let variance = values.reduce(0) { $0 + ($1 - mean) * ($1 - mean) } / Double(values.count - 1)
        return sqrt(variance)
    }

    private func buildRecommendations(rooms: [[String: Any]], wallDetails: [[String: Any]], coveragePct: Double, wallCount: Int) -> [String] {
        var recs: [String] = []
        for room in rooms {
            if let conf = room["confidence"] as? String, conf == "low" {
                recs.append("Verify \(room["name"] as? String ?? "Room") dimensions with a tape measure")
            }
        }
        let lowWalls = wallDetails.filter { ($0["confidence"] as? String) == "low" }
        if lowWalls.count > 0 { recs.append("Re-scan or tape-measure \(lowWalls.count) wall(s) with low confidence") }
        if coveragePct < 70 { recs.append("Scan coverage is \(Int(coveragePct))% — scan missed areas for better accuracy") }
        if wallCount < 4 { recs.append("Only \(wallCount) wall(s) detected — scan may be incomplete") }
        for room in rooms {
            if let l = room["length"] as? Double, let w = room["width"] as? Double, max(l, w) > 20.0 {
                recs.append("\(room["name"] as? String ?? "Room") is large — verify longest dimension")
            }
        }
        if recs.isEmpty { recs.append("Scan looks good — measurements within +/- 1 inch") }
        return recs
    }
}

// MARK: - RoomScanViewController with Real-Time Coaching

#if canImport(RoomPlan)
@available(iOS 16.0, *)
class RoomScanViewController: UIViewController, RoomCaptureViewDelegate, RoomCaptureSessionDelegate {
    var onComplete: ((CapturedRoom) -> Void)?
    var onCancel: (() -> Void)?
    var onError: ((String) -> Void)?

    private var captureView: RoomCaptureView!
    private var isProcessing = false
    private var capturedData: CapturedRoomData?
    private var didCallBack = false

    // Coaching UI
    private var coachingLabel: UILabel!
    private var statsLabel: UILabel!
    private var progressBar: UIView!
    private var progressFill: UIView!
    private var lastWallCount = 0
    private var lastUpdateTime = Date()
    private var noNewDataTimer: Timer?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black

        captureView = RoomCaptureView(frame: view.bounds)
        captureView.captureSession.delegate = self
        captureView.delegate = self
        captureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(captureView)

        // ── Coaching label (top center, animated) ──
        coachingLabel = UILabel()
        coachingLabel.text = "Point at a wall to start"
        coachingLabel.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        coachingLabel.textColor = .white
        coachingLabel.textAlignment = .center
        coachingLabel.backgroundColor = UIColor.black.withAlphaComponent(0.65)
        coachingLabel.layer.cornerRadius = 20
        coachingLabel.clipsToBounds = true
        coachingLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(coachingLabel)

        // ── Live stats (below coaching) ──
        statsLabel = UILabel()
        statsLabel.text = "0 walls · 0 doors · 0 windows"
        statsLabel.font = UIFont.monospacedSystemFont(ofSize: 12, weight: .medium)
        statsLabel.textColor = UIColor.white.withAlphaComponent(0.7)
        statsLabel.textAlignment = .center
        statsLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(statsLabel)

        // ── Progress bar ──
        progressBar = UIView()
        progressBar.backgroundColor = UIColor.white.withAlphaComponent(0.15)
        progressBar.layer.cornerRadius = 3
        progressBar.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(progressBar)

        progressFill = UIView()
        progressFill.backgroundColor = UIColor(red: 0, green: 0.443, blue: 0.89, alpha: 1.0)
        progressFill.layer.cornerRadius = 3
        progressFill.translatesAutoresizingMaskIntoConstraints = false
        progressBar.addSubview(progressFill)

        // ── Done button ──
        let doneBtn = UIButton(type: .system)
        doneBtn.setTitle("Done", for: .normal)
        doneBtn.titleLabel?.font = UIFont.systemFont(ofSize: 17, weight: .semibold)
        doneBtn.setTitleColor(.white, for: .normal)
        doneBtn.backgroundColor = UIColor(red: 0, green: 0.443, blue: 0.89, alpha: 1.0)
        doneBtn.layer.cornerRadius = 25
        doneBtn.translatesAutoresizingMaskIntoConstraints = false
        doneBtn.addTarget(self, action: #selector(doneTapped), for: .touchUpInside)
        view.addSubview(doneBtn)

        // ── Cancel button ──
        let cancelBtn = UIButton(type: .system)
        cancelBtn.setTitle("Cancel", for: .normal)
        cancelBtn.titleLabel?.font = UIFont.systemFont(ofSize: 15)
        cancelBtn.setTitleColor(UIColor.white.withAlphaComponent(0.8), for: .normal)
        cancelBtn.backgroundColor = UIColor.white.withAlphaComponent(0.15)
        cancelBtn.layer.cornerRadius = 20
        cancelBtn.translatesAutoresizingMaskIntoConstraints = false
        cancelBtn.addTarget(self, action: #selector(cancelTapped), for: .touchUpInside)
        view.addSubview(cancelBtn)

        NSLayoutConstraint.activate([
            // Coaching
            coachingLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            coachingLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            coachingLabel.widthAnchor.constraint(lessThanOrEqualTo: view.widthAnchor, constant: -32),
            coachingLabel.heightAnchor.constraint(equalToConstant: 40),

            // Stats
            statsLabel.topAnchor.constraint(equalTo: coachingLabel.bottomAnchor, constant: 8),
            statsLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),

            // Progress bar
            progressBar.bottomAnchor.constraint(equalTo: doneBtn.topAnchor, constant: -16),
            progressBar.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
            progressBar.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
            progressBar.heightAnchor.constraint(equalToConstant: 6),

            progressFill.leadingAnchor.constraint(equalTo: progressBar.leadingAnchor),
            progressFill.topAnchor.constraint(equalTo: progressBar.topAnchor),
            progressFill.bottomAnchor.constraint(equalTo: progressBar.bottomAnchor),
            progressFill.widthAnchor.constraint(equalToConstant: 0),

            // Done
            doneBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            doneBtn.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            doneBtn.widthAnchor.constraint(equalToConstant: 120),
            doneBtn.heightAnchor.constraint(equalToConstant: 50),

            // Cancel
            cancelBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            cancelBtn.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            cancelBtn.widthAnchor.constraint(equalToConstant: 90),
            cancelBtn.heightAnchor.constraint(equalToConstant: 40),
        ])

        // Start no-data detection timer
        noNewDataTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { [weak self] _ in
            self?.checkScanProgress()
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        let config = RoomCaptureSession.Configuration()
        captureView.captureSession.run(configuration: config)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        noNewDataTimer?.invalidate()
        noNewDataTimer = nil
    }

    // MARK: - Real-time coaching

    private func checkScanProgress() {
        let timeSinceUpdate = Date().timeIntervalSince(lastUpdateTime)

        if timeSinceUpdate > 4.0 && lastWallCount == 0 {
            updateCoaching("Point your camera at a wall", color: .systemYellow)
        } else if timeSinceUpdate > 3.0 {
            updateCoaching("Move closer to the wall", color: .systemOrange)
        } else if timeSinceUpdate > 6.0 {
            updateCoaching("Try moving to a different angle", color: .systemRed)
        }
    }

    private func updateCoaching(_ text: String, color: UIColor) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            UIView.animate(withDuration: 0.3) {
                self.coachingLabel.text = "  \(text)  "
                self.coachingLabel.backgroundColor = color.withAlphaComponent(0.8)
            }
        }
    }

    private func updateStats(walls: Int, doors: Int, windows: Int) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.statsLabel.text = "\(walls) walls · \(doors) doors · \(windows) windows"

            // Update progress (4 walls = 100%)
            let progress = min(1.0, CGFloat(walls) / 4.0)
            let barWidth = self.progressBar.bounds.width * progress
            UIView.animate(withDuration: 0.3) {
                self.progressFill.frame = CGRect(x: 0, y: 0, width: barWidth, height: 6)
            }

            // Update coaching based on progress
            if walls == 0 {
                self.updateCoaching("Point at a wall to start", color: .systemGray)
            } else if walls < 3 {
                self.updateCoaching("Keep scanning — find more walls", color: UIColor(red: 0, green: 0.443, blue: 0.89, alpha: 1))
            } else if walls < 4 {
                self.updateCoaching("Almost there — scan the last wall", color: UIColor(red: 0, green: 0.443, blue: 0.89, alpha: 1))
            } else {
                self.updateCoaching("Looking great! Tap Done when ready", color: UIColor.systemGreen)
            }
        }
    }

    // MARK: - Actions

    @objc private func doneTapped() {
        isProcessing = true
        noNewDataTimer?.invalidate()
        captureView.captureSession.stop()

        updateCoaching("Processing scan...", color: UIColor(red: 0, green: 0.443, blue: 0.89, alpha: 1))
    }

    @objc private func cancelTapped() {
        noNewDataTimer?.invalidate()
        captureView.captureSession.stop()
        guard !didCallBack else { return }
        didCallBack = true
        let callback = onCancel
        dismiss(animated: true) { callback?() }
    }

    private func finishWithResult(_ room: CapturedRoom) {
        guard !didCallBack else { return }
        didCallBack = true
        let callback = onComplete
        dismiss(animated: true) { callback?(room) }
    }

    private func finishWithError(_ message: String) {
        guard !didCallBack else { return }
        didCallBack = true
        let callback = onError
        dismiss(animated: true) { callback?(message) }
    }

    // MARK: - RoomCaptureViewDelegate

    func captureView(shouldPresent roomDataForProcessing: CapturedRoomData, error: (any Error)?) -> Bool {
        return true
    }

    func captureView(didPresent processedResult: CapturedRoom, error: (any Error)?) {
        guard isProcessing else { return }
        if let error = error {
            finishWithError("Scan processing failed: \(error.localizedDescription)")
            return
        }
        finishWithResult(processedResult)
    }

    // MARK: - RoomCaptureSessionDelegate — real-time updates + fallback

    func captureSession(_ session: RoomCaptureSession, didUpdate room: CapturedRoom) {
        lastUpdateTime = Date()
        let wallCount = room.walls.count
        if wallCount != lastWallCount {
            lastWallCount = wallCount
            // Haptic feedback when new wall detected
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
        }
        updateStats(walls: room.walls.count, doors: room.doors.count, windows: room.windows.count)
    }

    func captureSession(_ session: RoomCaptureSession, didEndWith data: CapturedRoomData, error: (any Error)?) {
        guard isProcessing else { return }
        capturedData = data

        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) { [weak self] in
            guard let self = self, !self.didCallBack, let data = self.capturedData else { return }
            Task {
                do {
                    let roomBuilder = RoomBuilder(options: [])
                    let room = try await roomBuilder.capturedRoom(from: data)
                    await MainActor.run { self.finishWithResult(room) }
                } catch {
                    await MainActor.run { self.finishWithError("Failed to process scan: \(error.localizedDescription)") }
                }
            }
        }
    }
}
#endif
