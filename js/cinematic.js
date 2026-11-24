(function () {
	"use strict";

	var YT_ID = "LUgpPmj6nR8";
	var metDay = new Date(2024, 10, 22, 0, 0, 0, 0);
	var scenes = [];
	var current = 0;
	var slideTimer = null;
	var slideIndex = 0;
	var heroSlides = [];
	var musicOn = false;
	var finaleTaps = 0;
	var heartsFired = false;

	function pad(n) {
		return n < 10 ? "0" + n : String(n);
	}

	function $(sel, root) {
		return (root || document).querySelector(sel);
	}

	function $all(sel, root) {
		return Array.prototype.slice.call((root || document).querySelectorAll(sel));
	}

	function anniversaryElapsed() {
		var now = new Date();
		var seconds = Math.max(0, (now - metDay) / 1000);
		var totalDays = Math.floor(seconds / 86400);
		var years = Math.floor(totalDays / 365);
		seconds %= 86400;
		var hours = Math.floor(seconds / 3600);
		var minutes = Math.floor((seconds % 3600) / 60);
		var secs = Math.floor(seconds % 60);

		var yearLine =
			years > 0
				? '<span class="clock-years">' +
				  years +
				  " year" +
				  (years !== 1 ? "s" : "") +
				  " together</span>"
				: "";

		var html =
			yearLine +
			'<span class="digit">' +
			totalDays +
			"</span> days · " +
			'<span class="digit">' +
			pad(hours) +
			"</span>:" +
			'<span class="digit">' +
			pad(minutes) +
			"</span>:" +
			'<span class="digit">' +
			pad(secs) +
			"</span>";

		var finale = $("#elapseClock");
		if (finale) finale.innerHTML = html;
	}

	function typeStory() {
		$all(".story-line").forEach(function (line, i) {
			setTimeout(function () {
				line.classList.add("visible");
			}, i * 650);
		});
	}

	function revealTimeline() {
		$all(".tl-card").forEach(function (card, i) {
			setTimeout(function () {
				card.classList.add("visible");
			}, i * 500);
		});
	}

	function updateNavButtons() {
		var nextBtn = $("#btnNext");
		var prevBtn = $("#btnPrev");
		var isLast = current >= scenes.length - 1;
		var isFirst = current === 0;

		if (nextBtn) {
			nextBtn.disabled = isLast;
			nextBtn.textContent = isLast ? "The end" : "Next";
			nextBtn.setAttribute("aria-disabled", isLast ? "true" : "false");
		}
		if (prevBtn) {
			prevBtn.disabled = isFirst;
			prevBtn.setAttribute("aria-disabled", isFirst ? "true" : "false");
		}
	}

	function activateScene(index) {
		if (index < 0 || index >= scenes.length) return;

		current = index;

		scenes.forEach(function (scene, i) {
			scene.classList.remove("is-active", "is-exit");
			if (i === index) {
				scene.classList.add("is-active");
			} else if (i < index) {
				scene.classList.add("is-exit");
			}
		});

		$all(".dot-nav button").forEach(function (dot, i) {
			dot.classList.toggle("active", i === index);
		});

		var fill = $(".progress-fill");
		if (fill) {
			fill.style.width = ((index + 1) / scenes.length) * 100 + "%";
		}

		if (index === 1) {
			$all(".tl-card").forEach(function (c) {
				c.classList.remove("visible");
			});
			setTimeout(revealTimeline, 300);
		}

		if (index === 2) {
			$all(".story-line").forEach(function (l) {
				l.classList.remove("visible");
			});
			setTimeout(typeStory, 400);
		}

		if (index === scenes.length - 1 && !heartsFired) {
			heartsFired = true;
			spawnHearts();
		}

		updateNavButtons();
	}

	function nextScene() {
		if (current >= scenes.length - 1) return;
		activateScene(current + 1);
	}

	function prevScene() {
		if (current > 0) activateScene(current - 1);
	}

	function openGate() {
		document.body.classList.remove("is-gated");
		var gate = $("#missMeGate");
		if (gate) gate.classList.add("gate-hidden");
		activateScene(0);
		startHeroSlideshow();
		setTimeout(function () {
			$all(".mask-photo").forEach(function (el) {
				el.classList.add("reveal");
			});
			var title = $(".hero-title");
			if (title) title.classList.add("reveal");
		}, 300);
		playMusic();
	}

	function playMusic() {
		var player = $("#musicPlayer");
		var btn = $("#musicToggle");
		if (!player || musicOn) return;
		player.innerHTML =
			'<iframe title="Our song" src="https://www.youtube.com/embed/' +
			YT_ID +
			"?autoplay=1&loop=1&playlist=" +
			YT_ID +
			"&controls=0" +
			'" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
		musicOn = true;
		if (btn) {
			btn.classList.add("is-on");
			btn.textContent = "♫ Playing";
		}
	}

	function toggleMusic() {
		var btn = $("#musicToggle");
		var player = $("#musicPlayer");
		if (!player) return;
		if (musicOn) {
			player.innerHTML = "";
			musicOn = false;
			if (btn) {
				btn.classList.remove("is-on");
				btn.textContent = "♫ Song";
			}
		} else {
			playMusic();
		}
	}

	function spawnHearts() {
		var rain = $("#heartRain");
		if (!rain) return;
		for (var i = 0; i < 28; i++) {
			var h = document.createElement("span");
			h.className = "rain-heart";
			h.textContent = "♥";
			h.style.left = Math.random() * 100 + "%";
			h.style.animationDelay = Math.random() * 2 + "s";
			h.style.fontSize = 10 + Math.random() * 16 + "px";
			rain.appendChild(h);
			setTimeout(
				function (el) {
					if (el.parentNode) el.parentNode.removeChild(el);
				},
				4500,
				h
			);
		}
	}

	function onFinalePhotoTap() {
		finaleTaps += 1;
		var secret = $("#secretLove");
		var photo = $("#finalePhoto");
		if (finaleTaps >= 3 && secret) {
			secret.hidden = false;
			secret.classList.add("show");
			if (photo) photo.classList.add("glow");
			spawnHearts();
		}
	}

	function openModal(src) {
		var img = $("#modalImg");
		var modal = $("#photoModal");
		if (img && modal && src) {
			img.src = src;
			modal.classList.add("open");
		}
	}

	function closeModal() {
		var modal = $("#photoModal");
		if (modal) modal.classList.remove("open");
	}

	function showHeroSlide(index) {
		if (!heroSlides.length) return;
		slideIndex = (index + heroSlides.length) % heroSlides.length;
		heroSlides.forEach(function (slide, i) {
			slide.classList.toggle("is-active", i === slideIndex);
		});
	}

	function startHeroSlideshow() {
		heroSlides = $all(".hero-slide");
		if (!heroSlides.length) return;
		showHeroSlide(0);
		if (slideTimer !== null) clearInterval(slideTimer);
		slideTimer = setInterval(function () {
			if (current === 0) showHeroSlide(slideIndex + 1);
		}, 4500);
	}

	function onDocumentClick(e) {
		var target = e.target;

		if (target.closest("#gateOpen")) {
			e.preventDefault();
			openGate();
			return;
		}

		if (target.closest("#musicToggle")) {
			e.preventDefault();
			toggleMusic();
			return;
		}

		if (target.closest("#btnNext")) {
			e.preventDefault();
			if ($("#btnNext").disabled) return;
			nextScene();
			return;
		}

		if (target.closest(".cta-enter")) {
			e.preventDefault();
			nextScene();
			return;
		}

		if (target.closest("#btnPrev")) {
			e.preventDefault();
			prevScene();
			return;
		}

		var dot = target.closest(".dot-nav button");
		if (dot && dot.hasAttribute("data-scene")) {
			e.preventDefault();
			var idx = parseInt(dot.getAttribute("data-scene"), 10);
			if (!isNaN(idx)) activateScene(idx);
			return;
		}

		if (target.closest("#finalePhoto")) {
			onFinalePhotoTap();
			return;
		}

		var tlPhoto = target.closest(".tl-photo");
		if (tlPhoto) {
			var tlImg = tlPhoto.querySelector("img");
			if (tlImg) openModal(tlImg.getAttribute("src"));
			return;
		}

		var thumb = target.closest(".gallery-item, .mask-photo");
		if (thumb) {
			var src =
				thumb.getAttribute("data-full") ||
				(thumb.querySelector("img") && thumb.querySelector("img").getAttribute("src"));
			if (src) openModal(src);
			return;
		}

		if (target.closest("#closePhoto") || target.closest("#photoModalBackdrop")) {
			closeModal();
		}
	}

	function init() {
		scenes = $all(".scene");
		if (!scenes.length) return;

		document.addEventListener("click", onDocumentClick);

		anniversaryElapsed();
		setInterval(anniversaryElapsed, 500);

		updateNavButtons();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();