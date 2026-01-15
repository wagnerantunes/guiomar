"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function AntigravityParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: 0, y: 0 };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor(width: number, height: number, isDark: boolean) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = isDark ? "rgba(19, 236, 91, 0.4)" : "rgba(13, 107, 107, 0.4)";
            }

            update(width: number, height: number) {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                else if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                else if (this.y < 0) this.y = height;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const isDark = theme === "dark";
            const count = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(canvas.width, canvas.height, isDark));
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        handleResize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update(canvas.width, canvas.height);
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0 opacity-50"
        />
    );
}
