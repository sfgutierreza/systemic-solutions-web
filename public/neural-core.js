(function () {
    "use strict";

    /**
     * Systemic Solutions — Núcleo 3D "sobrio"
     * Visual portado del ZIP aprobado (nucleosobrio): capas geométricas
     * anidadas, anillos orbitales finos con nodos técnicos y una rejilla de
     * puntos alineada a grilla. Sin glow ni bloom: la lectura es de
     * instrumento de precisión, no de efecto.
     *
     * La infraestructura (limpieza, resize, IntersectionObserver,
     * prefers-reduced-motion y dispose de recursos) se mantiene igual que en
     * la versión anterior para que sea un reemplazo directo.
     */
    window.createNeuralCore = function createNeuralCore(
        containerId,
        primaryColor = 0x47a3b3,
        scaleFactor = 1.3
    ) {
        const THREE = window.THREE;
        const container = document.getElementById(containerId);
        if (!THREE || !container) return null;

        if (typeof container.__neuralCoreCleanup === "function") {
            container.__neuralCoreCleanup();
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const desktopQuery = window.matchMedia("(min-width: 1024px)");
        const mobileQuery = window.matchMedia("(max-width: 767px)");

        const config = {
            primaryColor,                 // cian técnico
            secondaryColor: 0x2a445e,     // azul acero profundo
            tertiaryColor: 0xe5e2e1,      // blanco técnico
            coreScale: scaleFactor,
            particleCount: mobileQuery.matches ? 150 : 300,
            pixelRatioLimit: 1.5,
        };

        /** Radio del elemento más externo (anillo 3) + margen del nodo. */
        const BOUNDING_RADIUS = 1.95;
        /** Porción del lado más corto que puede ocupar el núcleo. */
        const FILL_RATIO = 0.92;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.z = 5;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (error) {
            container.dataset.coreStatus = "webgl-unavailable";
            return null;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.pixelRatioLimit));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.setAttribute("role", "presentation");
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        container.replaceChildren(renderer.domElement);
        container.dataset.coreStatus = "ready";

        const coreGroup = new THREE.Group();
        coreGroup.scale.set(0, 0, 0);
        scene.add(coreGroup);

        const shells = {};
        const rings = [];
        const disposableGeometries = [];
        const disposableMaterials = [];
        const pointer = { x: 0, y: 0 };
        const pointerTarget = { x: 0, y: 0 };

        let particles = null;
        let fittedScale = config.coreScale;
        let reducedMotion = motionQuery.matches;
        let isVisible = reducedMotion;
        let entryProgress = reducedMotion ? 1 : 0;
        let entryStartedAt = reducedMotion ? performance.now() : 0;
        let previousFrame = 0;
        let animationFrame = 0;
        let running = false;
        let resizeObserver = null;
        let visibilityObserver = null;

        const rememberGeometry = (geometry) => {
            disposableGeometries.push(geometry);
            return geometry;
        };

        const rememberMaterial = (material) => {
            disposableMaterials.push(material);
            return material;
        };

        /** Malla de líneas a partir de una geometría sólida. */
        function wireframeOf(geometry, color, opacity) {
            const wire = rememberGeometry(new THREE.WireframeGeometry(geometry));
            const material = rememberMaterial(
                new THREE.LineBasicMaterial({ color, transparent: true, opacity })
            );
            return new THREE.LineSegments(wire, material);
        }

        function createCoreLayers() {
            // Núcleo sólido interior.
            const innerGeo = rememberGeometry(new THREE.IcosahedronGeometry(0.6, 2));
            const innerMat = rememberMaterial(
                new THREE.MeshBasicMaterial({
                    color: config.secondaryColor,
                    transparent: true,
                    opacity: 0.8,
                })
            );
            shells.inner = new THREE.Mesh(innerGeo, innerMat);
            coreGroup.add(shells.inner);

            // Retícula precisa sobre el núcleo.
            const wireGeo = rememberGeometry(new THREE.IcosahedronGeometry(0.62, 2));
            shells.wire = wireframeOf(wireGeo, config.primaryColor, 0.5);
            coreGroup.add(shells.wire);

            // Cáscara geométrica intermedia.
            const midGeo = rememberGeometry(new THREE.OctahedronGeometry(0.85, 1));
            shells.mid = wireframeOf(midGeo, config.primaryColor, 0.3);
            coreGroup.add(shells.mid);

            // Cáscara técnica exterior.
            const outerGeo = rememberGeometry(new THREE.DodecahedronGeometry(1.05, 1));
            shells.outer = wireframeOf(outerGeo, config.secondaryColor, 0.4);
            coreGroup.add(shells.outer);
        }

        function createOrbitalRings() {
            const ringConfigs = [
                { radius: 1.3, tiltX: Math.PI / 2, tiltZ: 0, speed: 0.002, color: config.primaryColor },
                { radius: 1.6, tiltX: Math.PI / 3, tiltZ: Math.PI / 4, speed: -0.003, color: config.tertiaryColor },
                { radius: 1.9, tiltX: -Math.PI / 4, tiltZ: -Math.PI / 6, speed: 0.0015, color: config.secondaryColor },
            ];

            ringConfigs.forEach((rc) => {
                const ringGeo = rememberGeometry(
                    new THREE.RingGeometry(rc.radius - 0.005, rc.radius, 64)
                );
                const ringMat = rememberMaterial(
                    new THREE.MeshBasicMaterial({
                        color: rc.color,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.4,
                    })
                );
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = rc.tiltX;
                ring.rotation.y = rc.tiltZ;

                // Marcadores técnicos: giran solidarios al anillo.
                const nodeGeo = rememberGeometry(new THREE.BoxGeometry(0.03, 0.03, 0.03));
                const nodeMat = rememberMaterial(
                    new THREE.MeshBasicMaterial({ color: config.tertiaryColor })
                );
                for (let j = 0; j < 4; j += 1) {
                    const node = new THREE.Mesh(nodeGeo, nodeMat);
                    const angle = (j / 4) * Math.PI * 2;
                    node.position.set(
                        Math.cos(angle) * rc.radius,
                        Math.sin(angle) * rc.radius,
                        0
                    );
                    ring.add(node);
                }

                const wrapper = new THREE.Group();
                wrapper.add(ring);
                coreGroup.add(wrapper);
                rings.push({ mesh: ring, speed: rc.speed });
            });
        }

        function createDataGrid() {
            const geometry = rememberGeometry(new THREE.BufferGeometry());
            const vertices = [];
            const colors = [];

            const colorPrimary = new THREE.Color(config.primaryColor);
            const colorSecondary = new THREE.Color(config.secondaryColor);
            const gridSnap = 0.5;

            for (let i = 0; i < config.particleCount; i += 1) {
                // Puntos alineados a una grilla: lectura de matriz, no de polvo.
                const x = Math.round(((Math.random() - 0.5) * 8) / gridSnap) * gridSnap;
                const y = Math.round(((Math.random() - 0.5) * 8) / gridSnap) * gridSnap;
                const z = Math.round(((Math.random() - 0.5) * 8) / gridSnap) * gridSnap;
                vertices.push(x, y, z);

                const c = Math.random() > 0.3 ? colorSecondary : colorPrimary;
                colors.push(c.r, c.g, c.b);
            }

            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

            const material = rememberMaterial(
                new THREE.PointsMaterial({
                    size: 0.02,
                    transparent: true,
                    opacity: 0.6,
                    vertexColors: true,
                    blending: THREE.AdditiveBlending,
                })
            );

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }

        function resize() {
            const width = Math.max(1, container.clientWidth);
            const height = Math.max(1, container.clientHeight);
            const aspect = width / height;

            camera.aspect = aspect;
            camera.position.z = mobileQuery.matches ? 7.35 : 7.2;
            camera.updateProjectionMatrix();

            // Ajuste de tamaño del núcleo: nunca debe recortarse contra los
            // bordes del contenedor, sea cual sea el viewport.
            const visibleHeight =
                2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
            const visibleWidth = visibleHeight * aspect;
            const maxScale =
                (Math.min(visibleWidth, visibleHeight) * FILL_RATIO) / (2 * BOUNDING_RADIUS);
            fittedScale = Math.min(config.coreScale, maxScale);

            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.pixelRatioLimit));
            renderer.setSize(width, height, false);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";

            if (entryProgress >= 1) coreGroup.scale.setScalar(fittedScale);
            if (reducedMotion) renderStatic();
        }

        function onPointerMove(event) {
            const rect = container.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        }

        function onPointerLeave() {
            pointerTarget.x = 0;
            pointerTarget.y = 0;
        }

        /** Fotograma único y quieto para prefers-reduced-motion. */
        function renderStatic() {
            entryProgress = 1;
            coreGroup.scale.setScalar(fittedScale);
            coreGroup.position.y = 0;
            coreGroup.rotation.set(0.1, 0.2, 0);
            if (particles) particles.visible = false;
            renderer.render(scene, camera);
        }

        function animate(now) {
            if (!running) return;
            animationFrame = window.requestAnimationFrame(animate);

            if (!previousFrame) previousFrame = now;
            // Normalizado a 60fps: la animación va igual en cualquier pantalla.
            const frameScale = Math.min((now - previousFrame) / 16.6667, 3);
            previousFrame = now;

            if (entryProgress < 1) {
                if (!entryStartedAt) entryStartedAt = now;
                entryProgress = Math.min((now - entryStartedAt) / 1000, 1);
                const eased = 0.82 + (fittedScale - 0.82) * entryProgress;
                coreGroup.scale.setScalar(eased);
                coreGroup.position.y = (1 - entryProgress) * -0.5;
            }

            if (shells.inner) {
                shells.inner.rotation.y += 0.002 * frameScale;
                shells.inner.rotation.x += 0.001 * frameScale;
            }
            if (shells.wire) {
                shells.wire.rotation.y += 0.002 * frameScale;
                shells.wire.rotation.x += 0.001 * frameScale;
            }
            if (shells.mid) {
                shells.mid.rotation.y -= 0.003 * frameScale;
                shells.mid.rotation.z += 0.002 * frameScale;
            }
            if (shells.outer) {
                shells.outer.rotation.x += 0.001 * frameScale;
                shells.outer.rotation.y -= 0.002 * frameScale;
            }

            rings.forEach((r) => {
                r.mesh.rotation.z += r.speed * frameScale;
            });

            if (particles) {
                const pulse = Math.sin(now * 0.001) * 0.2 + 0.8;
                particles.material.opacity = 0.4 * pulse;
            }

            if (desktopQuery.matches) {
                pointer.x += (pointerTarget.x - pointer.x) * 0.05 * frameScale;
                pointer.y += (pointerTarget.y - pointer.y) * 0.05 * frameScale;
                coreGroup.rotation.y = pointer.x * 0.2;
                coreGroup.rotation.x = -pointer.y * 0.2;
            } else {
                coreGroup.rotation.y = Math.sin(now * 0.0005) * 0.1;
                coreGroup.rotation.x = Math.cos(now * 0.0003) * 0.05;
            }

            renderer.render(scene, camera);
        }

        function startAnimation() {
            if (running || reducedMotion || !isVisible) return;
            running = true;
            previousFrame = 0;
            animationFrame = window.requestAnimationFrame(animate);
        }

        function stopAnimation() {
            running = false;
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = 0;
            }
        }

        function onVisibilityChange() {
            if (document.hidden) stopAnimation();
            else startAnimation();
        }

        function onMotionPreferenceChange(event) {
            reducedMotion = event.matches;
            if (reducedMotion) {
                stopAnimation();
                renderStatic();
            } else {
                if (particles) particles.visible = true;
                entryProgress = 0;
                entryStartedAt = 0;
                startAnimation();
            }
        }

        createCoreLayers();
        createOrbitalRings();
        createDataGrid();
        resize();

        if (desktopQuery.matches) {
            container.addEventListener("pointermove", onPointerMove, { passive: true });
            container.addEventListener("pointerleave", onPointerLeave, { passive: true });
        }
        document.addEventListener("visibilitychange", onVisibilityChange);
        if (typeof motionQuery.addEventListener === "function") {
            motionQuery.addEventListener("change", onMotionPreferenceChange);
        }

        if ("ResizeObserver" in window) {
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(container);
        } else {
            window.addEventListener("resize", resize, { passive: true });
        }

        if ("IntersectionObserver" in window) {
            visibilityObserver = new IntersectionObserver(
                (entries) => {
                    isVisible = entries.some((entry) => entry.isIntersecting);
                    if (isVisible) {
                        if (entryProgress === 0 && !entryStartedAt) {
                            entryStartedAt = performance.now();
                        }
                        startAnimation();
                    } else {
                        stopAnimation();
                    }
                },
                { threshold: 0.1 }
            );
            visibilityObserver.observe(container);
        } else {
            isVisible = true;
            startAnimation();
        }

        if (reducedMotion) renderStatic();

        const cleanup = () => {
            stopAnimation();
            if (resizeObserver) resizeObserver.disconnect();
            else window.removeEventListener("resize", resize);
            if (visibilityObserver) visibilityObserver.disconnect();
            document.removeEventListener("visibilitychange", onVisibilityChange);
            container.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerleave", onPointerLeave);
            if (typeof motionQuery.removeEventListener === "function") {
                motionQuery.removeEventListener("change", onMotionPreferenceChange);
            }
            disposableGeometries.forEach((geometry) => geometry.dispose());
            disposableMaterials.forEach((material) => material.dispose());
            renderer.dispose();
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            delete container.__neuralCoreCleanup;
            delete container.dataset.coreStatus;
        };

        container.__neuralCoreCleanup = cleanup;
        return cleanup;
    };
})();
