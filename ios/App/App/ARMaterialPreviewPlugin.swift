import Foundation
import Capacitor
import ARKit
import RealityKit

/// Capacitor plugin for AR material preview — overlays flooring/paint textures
/// on real surfaces using ARKit plane detection.
/// Requires iOS 15+ and a device with ARKit support (A9+ chip).
@objc(ARMaterialPreviewPlugin)
public class ARMaterialPreviewPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ARMaterialPreviewPlugin"
    public let jsName = "ARMaterialPreview"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startPreview", returnType: CAPPluginReturnPromise),
    ]

    private var savedCall: CAPPluginCall?

    // MARK: - isAvailable

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": ARWorldTrackingConfiguration.isSupported])
    }

    // MARK: - startPreview

    @objc func startPreview(_ call: CAPPluginCall) {
        guard ARWorldTrackingConfiguration.isSupported else {
            call.reject("ARKit not supported on this device")
            return
        }

        // Parse materials from JS
        guard let materialsArray = call.getArray("materials") as? [[String: Any]] else {
            call.reject("materials array is required")
            return
        }

        var materials: [ARMaterial] = []
        for mat in materialsArray {
            guard let name = mat["name"] as? String,
                  let color = mat["color"] as? String else { continue }
            materials.append(ARMaterial(
                name: name,
                color: color,
                textureUrl: mat["textureUrl"] as? String,
                scale: mat["scale"] as? Float ?? 1.0
            ))
        }

        guard !materials.isEmpty else {
            call.reject("At least one material is required")
            return
        }

        let mode = call.getString("mode") ?? "floor"

        savedCall = call
        call.keepAlive = true

        DispatchQueue.main.async { [weak self] in
            self?.presentARPreview(materials: materials, mode: mode)
        }
    }

    private func presentARPreview(materials: [ARMaterial], mode: String) {
        guard let vc = bridge?.viewController else {
            savedCall?.reject("No view controller available")
            savedCall = nil
            return
        }

        let arVC = ARMaterialPreviewViewController()
        arVC.materials = materials
        arVC.surfaceMode = mode == "wall" ? .wall : .floor
        arVC.modalPresentationStyle = .fullScreen
        arVC.onDismiss = { [weak self] selectedMaterial in
            self?.savedCall?.resolve([
                "selectedMaterial": selectedMaterial ?? "",
                "dismissed": true,
            ])
            self?.savedCall = nil
        }

        vc.present(arVC, animated: true)
    }
}

// MARK: - Data Types

struct ARMaterial {
    let name: String
    let color: String     // hex color e.g. "#8B4513"
    let textureUrl: String?
    let scale: Float
}

enum SurfaceMode {
    case floor
    case wall
}

// MARK: - AR Preview View Controller

class ARMaterialPreviewViewController: UIViewController, ARSessionDelegate {
    var materials: [ARMaterial] = []
    var surfaceMode: SurfaceMode = .floor
    var onDismiss: ((String?) -> Void)?

    private var arView: ARView!
    private var currentMaterialIndex = 0
    private var planeAnchors: [UUID: AnchorEntity] = [:]
    private var materialLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()

        // AR View
        arView = ARView(frame: view.bounds)
        arView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        arView.session.delegate = self
        arView.environment.sceneUnderstanding.options = [.receivesLighting]
        view.addSubview(arView)

        // Material name label
        materialLabel = UILabel()
        materialLabel.textAlignment = .center
        materialLabel.font = UIFont.boldSystemFont(ofSize: 18)
        materialLabel.textColor = .white
        materialLabel.backgroundColor = UIColor.black.withAlphaComponent(0.6)
        materialLabel.layer.cornerRadius = 12
        materialLabel.clipsToBounds = true
        materialLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(materialLabel)

        // Instructions label
        let instructionLabel = UILabel()
        instructionLabel.text = surfaceMode == .floor
            ? "Point at the floor to preview materials"
            : "Point at the wall to preview materials"
        instructionLabel.textAlignment = .center
        instructionLabel.font = UIFont.systemFont(ofSize: 14)
        instructionLabel.textColor = .white
        instructionLabel.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        instructionLabel.layer.cornerRadius = 8
        instructionLabel.clipsToBounds = true
        instructionLabel.translatesAutoresizingMaskIntoConstraints = false
        instructionLabel.tag = 100
        view.addSubview(instructionLabel)

        // Next material button
        let nextBtn = UIButton(type: .system)
        nextBtn.setTitle("Next Material", for: .normal)
        nextBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
        nextBtn.setTitleColor(.white, for: .normal)
        nextBtn.backgroundColor = UIColor.systemBlue
        nextBtn.layer.cornerRadius = 12
        nextBtn.translatesAutoresizingMaskIntoConstraints = false
        nextBtn.addTarget(self, action: #selector(nextMaterial), for: .touchUpInside)
        view.addSubview(nextBtn)

        // Previous material button
        let prevBtn = UIButton(type: .system)
        prevBtn.setTitle("Prev", for: .normal)
        prevBtn.titleLabel?.font = UIFont.systemFont(ofSize: 15)
        prevBtn.setTitleColor(.white, for: .normal)
        prevBtn.backgroundColor = UIColor.systemGray.withAlphaComponent(0.7)
        prevBtn.layer.cornerRadius = 12
        prevBtn.translatesAutoresizingMaskIntoConstraints = false
        prevBtn.addTarget(self, action: #selector(prevMaterial), for: .touchUpInside)
        view.addSubview(prevBtn)

        // Close button
        let closeBtn = UIButton(type: .system)
        closeBtn.setTitle("Done", for: .normal)
        closeBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
        closeBtn.setTitleColor(.white, for: .normal)
        closeBtn.backgroundColor = UIColor.systemGreen
        closeBtn.layer.cornerRadius = 12
        closeBtn.translatesAutoresizingMaskIntoConstraints = false
        closeBtn.addTarget(self, action: #selector(closeTapped), for: .touchUpInside)
        view.addSubview(closeBtn)

        // Cancel button
        let cancelBtn = UIButton(type: .system)
        cancelBtn.setTitle("Cancel", for: .normal)
        cancelBtn.titleLabel?.font = UIFont.systemFont(ofSize: 15)
        cancelBtn.setTitleColor(.white, for: .normal)
        cancelBtn.backgroundColor = UIColor.systemRed.withAlphaComponent(0.7)
        cancelBtn.layer.cornerRadius = 12
        cancelBtn.translatesAutoresizingMaskIntoConstraints = false
        cancelBtn.addTarget(self, action: #selector(cancelTapped), for: .touchUpInside)
        view.addSubview(cancelBtn)

        NSLayoutConstraint.activate([
            // Material label at top
            materialLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            materialLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            materialLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 150),
            materialLabel.heightAnchor.constraint(equalToConstant: 40),

            // Instructions below material label
            instructionLabel.topAnchor.constraint(equalTo: materialLabel.bottomAnchor, constant: 12),
            instructionLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            instructionLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 200),
            instructionLabel.heightAnchor.constraint(equalToConstant: 32),

            // Nav buttons at bottom
            prevBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            prevBtn.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            prevBtn.widthAnchor.constraint(equalToConstant: 70),
            prevBtn.heightAnchor.constraint(equalToConstant: 44),

            nextBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            nextBtn.leadingAnchor.constraint(equalTo: prevBtn.trailingAnchor, constant: 12),
            nextBtn.widthAnchor.constraint(equalToConstant: 130),
            nextBtn.heightAnchor.constraint(equalToConstant: 44),

            closeBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            closeBtn.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            closeBtn.widthAnchor.constraint(equalToConstant: 80),
            closeBtn.heightAnchor.constraint(equalToConstant: 44),

            cancelBtn.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -72),
            cancelBtn.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            cancelBtn.widthAnchor.constraint(equalToConstant: 80),
            cancelBtn.heightAnchor.constraint(equalToConstant: 36),
        ])

        updateMaterialLabel()
        startARSession()

        // Hide instruction after 5 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) { [weak self] in
            UIView.animate(withDuration: 0.5) {
                self?.view.viewWithTag(100)?.alpha = 0
            }
        }
    }

    private func startARSession() {
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = surfaceMode == .floor ? .horizontal : .vertical
        config.environmentTexturing = .automatic
        arView.session.run(config)
    }

    // MARK: - Material navigation

    @objc private func nextMaterial() {
        currentMaterialIndex = (currentMaterialIndex + 1) % materials.count
        updateMaterialLabel()
        updateAllPlanes()
        hapticFeedback()
    }

    @objc private func prevMaterial() {
        currentMaterialIndex = (currentMaterialIndex - 1 + materials.count) % materials.count
        updateMaterialLabel()
        updateAllPlanes()
        hapticFeedback()
    }

    @objc private func closeTapped() {
        let selected = materials[currentMaterialIndex].name
        arView.session.pause()
        dismiss(animated: true) { [weak self] in
            self?.onDismiss?(selected)
        }
    }

    @objc private func cancelTapped() {
        arView.session.pause()
        dismiss(animated: true) { [weak self] in
            self?.onDismiss?(nil)
        }
    }

    private func updateMaterialLabel() {
        let mat = materials[currentMaterialIndex]
        materialLabel.text = "  \(mat.name)  (\(currentMaterialIndex + 1)/\(materials.count))  "
    }

    private func hapticFeedback() {
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
    }

    // MARK: - ARSessionDelegate

    func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
        for anchor in anchors {
            guard let planeAnchor = anchor as? ARPlaneAnchor else { continue }

            // Filter by surface type
            if surfaceMode == .floor && planeAnchor.alignment != .horizontal { continue }
            if surfaceMode == .wall && planeAnchor.alignment != .vertical { continue }

            let anchorEntity = AnchorEntity(anchor: planeAnchor)
            let mesh = createPlaneMesh(for: planeAnchor)
            anchorEntity.addChild(mesh)
            arView.scene.addAnchor(anchorEntity)
            planeAnchors[anchor.identifier] = anchorEntity
        }
    }

    func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
        for anchor in anchors {
            guard let planeAnchor = anchor as? ARPlaneAnchor,
                  let anchorEntity = planeAnchors[anchor.identifier] else { continue }

            // Remove old mesh and add updated one
            anchorEntity.children.removeAll()
            let mesh = createPlaneMesh(for: planeAnchor)
            anchorEntity.addChild(mesh)
        }
    }

    func session(_ session: ARSession, didRemove anchors: [ARAnchor]) {
        for anchor in anchors {
            if let entity = planeAnchors.removeValue(forKey: anchor.identifier) {
                arView.scene.removeAnchor(entity)
            }
        }
    }

    // MARK: - Mesh creation

    private func createPlaneMesh(for planeAnchor: ARPlaneAnchor) -> ModelEntity {
        let mat = materials[currentMaterialIndex]
        let width = planeAnchor.planeExtent.width
        let height = planeAnchor.planeExtent.height

        let planeMesh = MeshResource.generatePlane(width: width, depth: height)
        var material = SimpleMaterial()

        // Parse hex color
        material.color = .init(tint: colorFromHex(mat.color).withAlphaComponent(0.85))

        // Apply texture if available and loadable
        if let textureUrl = mat.textureUrl, let url = URL(string: textureUrl) {
            if let textureResource = try? TextureResource.load(contentsOf: url) {
                material.color = .init(
                    tint: .white.withAlphaComponent(0.9),
                    texture: .init(textureResource)
                )
            }
        }

        material.roughness = .float(0.4)
        material.metallic = .float(0.1)

        let modelEntity = ModelEntity(mesh: planeMesh, materials: [material])

        // Position at plane center offset
        let center = planeAnchor.center
        modelEntity.position = SIMD3(center.x, 0, center.z)

        return modelEntity
    }

    private func updateAllPlanes() {
        for (id, anchorEntity) in planeAnchors {
            guard let anchor = arView.session.currentFrame?.anchors.first(where: { $0.identifier == id }) as? ARPlaneAnchor else { continue }
            anchorEntity.children.removeAll()
            let mesh = createPlaneMesh(for: anchor)
            anchorEntity.addChild(mesh)
        }
    }

    private func colorFromHex(_ hex: String) -> UIColor {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)

        return UIColor(
            red: CGFloat((rgb >> 16) & 0xFF) / 255.0,
            green: CGFloat((rgb >> 8) & 0xFF) / 255.0,
            blue: CGFloat(rgb & 0xFF) / 255.0,
            alpha: 1.0
        )
    }
}
