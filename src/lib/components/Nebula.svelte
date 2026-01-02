<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	let width = 0;
	let height = 0;
	let time = 0;

	type Star = {
		x: number;
		y: number;
		r: number;
		speed: number;
	};

	const stars: Star[] = [];
	const STAR_COUNT = 300;

	function resize(): void {
		width = window.innerWidth;
		height = window.innerHeight;

		canvas.width = width;
		canvas.height = height;
	}

	function createStars(): void {
		stars.length = 0;
		for (let i = 0; i < STAR_COUNT; i++) {
			stars.push({
				x: Math.random() * width,
				y: Math.random() * height,
				r: Math.random() * 1.5 + 0.2,
				speed: Math.random() * 0.05 + 0.02
			});
		}
	}

	function drawStars(): void {
		ctx.fillStyle = 'rgba(255,255,255,0.8)';

		for (const s of stars) {
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
			ctx.fill();

			s.y += s.speed;
			if (s.y > height) {
				s.y = 0;
				s.x = Math.random() * width;
			}
		}
	}

	function drawNebula(): void {
		const imageData = ctx.createImageData(width, height);
		const data = imageData.data;

		for (let y = 0; y < height; y += 2) {
			for (let x = 0; x < width; x += 2) {
				const i = (y * width + x) * 4;

				const nx = x / width - 0.5;
				const ny = y / height - 0.5;

				const v =
					Math.sin(nx * 3 + time * 0.0004) +
					Math.cos(ny * 4 + time * 0.0003) +
					Math.sin((nx + ny) * 2);

				data[i] = 120 + 80 * Math.sin(v + time * 0.0006); // R
				data[i + 1] = 80 + 80 * Math.sin(v + time * 0.0008 + 2); // G
				data[i + 2] = 150 + 80 * Math.sin(v + time * 0.0007 + 4); // B
				data[i + 3] = 35; // Alpha
			}
		}

		ctx.putImageData(imageData, 0, 0);
	}

	function animate(): void {
		time++;

		ctx.clearRect(0, 0, width, height);

		drawNebula();

		ctx.globalCompositeOperation = 'lighter';
		drawStars();
		ctx.globalCompositeOperation = 'source-over';

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;

		ctx = context;

		resize();
		createStars();
		animate();

		window.addEventListener('resize', resize);
	});

	onDestroy(() => {
		cancelAnimationFrame(animationId);
		window.removeEventListener('resize', resize);
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: var(--z-bg);
		background: var(--bg);
	}
</style>
