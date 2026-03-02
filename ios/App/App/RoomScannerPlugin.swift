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

    // MARK: - isAvailable

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

    // MARK: - startScan

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
                self?.presentScanner()
            }
        } else {
            call.reject("Requires iOS 16 or later")
        }
        #else
        call.reject("RoomPlan framework not available")
        #endif
    }

    // MARK: - Present the scanner

    @available(iOS 16.0, *)
    private func presentScanner() {
        #if canImport(RoomPlan)
        let scanVC = RoomScanViewController()
        scanVC.modalPresentationStyle = .fullScreen
        scanVC.onComplete = { [weak self] result in
            self?.handleScanResult(result)
        }
        scanVC.onCancel = { [weak self] in
            self?.savedCall?.reject("Scan cancelled by user")
            self?.savedCall = nil
        }

        bridge?.viewController?.present(scanVC, animated: true)
        #endif
    }

    // MARK: - Process scan result

    @available(iOS 16.0, *)
    private func handleScanResult(_ room: Any) {
        #if canImport(RoomPlan)
        guard let capturedRoom = room as? CapturedRoom else {
            savedCall?.reject("Invalid scan result")
            savedCall = nil
            return
        }

        var rooms: [[String: Any]] = []
        let metersToFeet = 3.28084

        // Use floors API on iOS 17+ for per-room detection
        if #available(iOS 17.0, *) {
            for (index, floor) in capturedRoom.floors.enumerated() {
                let dims = floor.dimensions
                let length = Double(dims.x) * metersToFeet
                let width = Double(dims.z) * metersToFeet
                let height = findWallHeight(for: floor, in: capturedRoom) * metersToFeet

                let floorArea = length * width
                let wallArea = 2.0 * (length + width) * height

                rooms.append([
                    "name": "Room \(index + 1)",
                    "length": round(length * 10.0) / 10.0,
                    "width": round(width * 10.0) / 10.0,
                    "height": round(height * 10.0) / 10.0,
                    "floorArea": round(floorArea * 10.0) / 10.0,
                    "wallArea": round(wallArea * 10.0) / 10.0,
                ])
            }
        }

        // Fallback: derive from walls (iOS 16, or if no floors detected)
        if rooms.isEmpty && !capturedRoom.walls.isEmpty {
            let wallHeights = capturedRoom.walls.map { Double($0.dimensions.y) }
            let avgHeight = (wallHeights.reduce(0, +) / Double(wallHeights.count)) * metersToFeet

            // Compute bounding box from wall positions
            var minX = Double.infinity, maxX = -Double.infinity
            var minZ = Double.infinity, maxZ = -Double.infinity
            for wall in capturedRoom.walls {
                let pos = wall.transform.columns.3
                let halfW = Double(wall.dimensions.x) / 2.0
                minX = min(minX, Double(pos.x) - halfW)
                maxX = max(maxX, Double(pos.x) + halfW)
                minZ = min(minZ, Double(pos.z) - halfW)
                maxZ = max(maxZ, Double(pos.z) + halfW)
            }

            let length = (maxX - minX) * metersToFeet
            let width = (maxZ - minZ) * metersToFeet
            let floorArea = length * width
            let wallArea = 2.0 * (length + width) * avgHeight

            rooms.append([
                "name": "Room 1",
                "length": round(length * 10.0) / 10.0,
                "width": round(width * 10.0) / 10.0,
                "height": round(avgHeight * 10.0) / 10.0,
                "floorArea": round(floorArea * 10.0) / 10.0,
                "wallArea": round(wallArea * 10.0) / 10.0,
            ])
        }

        var floorCount = 0
        if #available(iOS 17.0, *) {
            floorCount = capturedRoom.floors.count
        }
        let surfaceCount = capturedRoom.walls.count + floorCount

        // Count openings (doors, windows) for reference
        var openingCount = 0
        if #available(iOS 17.0, *) {
            // In iOS 17+, openings are available via sections
        }
        openingCount = capturedRoom.doors.count + capturedRoom.windows.count

        savedCall?.resolve([
            "rooms": rooms,
            "surfaceCount": surfaceCount,
            "wallCount": capturedRoom.walls.count,
            "floorCount": floorCount,
            "doorCount": capturedRoom.doors.count,
            "windowCount": capturedRoom.windows.count,
            "openingCount": openingCount,
        ])
        savedCall = nil
        #endif
    }

    @available(iOS 17.0, *)
    private func findWallHeight(for floor: CapturedRoom.Surface, in room: CapturedRoom) -> Double {
        #if canImport(RoomPlan)
        let floorPos = floor.transform.columns.3

        // Find walls closest to this floor
        var bestHeight: Double = 2.44 // Default 8ft in meters
        var bestDist = Double.infinity

        for wall in room.walls {
            let wallPos = wall.transform.columns.3
            let dx = Double(wallPos.x - floorPos.x)
            let dz = Double(wallPos.z - floorPos.z)
            let dist = sqrt(dx * dx + dz * dz)

            if dist < bestDist {
                bestDist = dist
                bestHeight = Double(wall.dimensions.y) // Wall height is the y dimension
            }
        }

        return bestHeight
        #else
        return 2.44
        #endif
    }
}

// MARK: - RoomScanViewController

#if canImport(RoomPlan)
@available(iOS 16.0, *)
class RoomScanViewController: UIViewController, RoomCaptureViewDelegate, RoomCaptureSessionDelegate {
    var onComplete: ((Any) -> Void)?
    var onCancel: (() -> Void)?

    private var captureView: RoomCaptureView!
    private var isProcessing = false

    override func viewDidLoad() {
        super.viewDidLoad()

        captureView = RoomCaptureView(frame: view.bounds)
        captureView.captureSession.delegate = self
        captureView.delegate = self
        captureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(captureView)

        // Done button
        let doneBtn = UIButton(type: .system)
        doneBtn.setTitle("Done", for: .normal)
        doneBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
        doneBtn.setTitleColor(.white, for: .normal)
        doneBtn.backgroundColor = UIColor.systemBlue
        doneBtn.layer.cornerRadius = 12
        doneBtn.translatesAutoresizingMaskIntoConstraints = false
        doneBtn.addTarget(self, action: #selector(doneTapped), for: .touchUpInside)
        view.addSubview(doneBtn)

        // Cancel button
        let cancelBtn = UIButton(type: .system)
        cancelBtn.setTitle("Cancel", for: .normal)
        cancelBtn.titleLabel?.font = UIFont.systemFont(ofSize: 17)
        cancelBtn.setTitleColor(.white, for: .normal)
        cancelBtn.backgroundColor = UIColor.systemGray.withAlphaComponent(0.7)
        cancelBtn.layer.cornerRadius = 12
        cancelBtn.translatesAutoresizingMaskIntoConstraints = false
        cancelBtn.addTarget(self, action: #selector(cancelTapped), for: .touchUpInside)
        view.addSubview(cancelBtn)

        NSLayoutConstraint.activate([
            doneBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            doneBtn.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            doneBtn.widthAnchor.constraint(equalToConstant: 100),
            doneBtn.heightAnchor.constraint(equalToConstant: 44),

            cancelBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            cancelBtn.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            cancelBtn.widthAnchor.constraint(equalToConstant: 100),
            cancelBtn.heightAnchor.constraint(equalToConstant: 44),
        ])
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        let config = RoomCaptureSession.Configuration()
        captureView.captureSession.run(configuration: config)
    }

    @objc private func doneTapped() {
        isProcessing = true
        captureView.captureSession.stop()
    }

    @objc private func cancelTapped() {
        captureView.captureSession.stop()
        dismiss(animated: true) { [weak self] in
            self?.onCancel?()
        }
    }

    // RoomCaptureViewDelegate — called when processing is complete
    func captureView(_ view: RoomCaptureView, didPresent processedResult: CapturedRoom, error: (any Error)?) {
        if isProcessing {
            dismiss(animated: true) { [weak self] in
                self?.onComplete?(processedResult)
            }
        }
    }

    // RoomCaptureSessionDelegate — fallback: use raw data if view delegate doesn't fire
    private var lastCapturedData: CapturedRoomData?

    func captureSession(_ session: RoomCaptureSession, didEndWith data: CapturedRoomData, error: (any Error)?) {
        lastCapturedData = data
        // If the view delegate doesn't fire within 2 seconds, process from raw data
        if isProcessing {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                guard let self = self, self.isProcessing else { return }
                // View delegate didn't fire — try processing raw data
                if let data = self.lastCapturedData {
                    let finalRoom = try? CapturedRoom(from: data)
                    self.dismiss(animated: true) {
                        if let room = finalRoom {
                            self.onComplete?(room)
                        } else {
                            self.onCancel?()
                        }
                    }
                }
            }
        }
    }
}
#endif
