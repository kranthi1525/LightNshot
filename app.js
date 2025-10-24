// Navbar load animation
    window.addEventListener("load", () => {
      const navbar = document.getElementById("navbar");
      navbar.classList.add("show");
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("show");
    });


/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i/$items.length) * 100 + 10
    animate()
  })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
  const wheelProgress = e.deltaY * speedWheel
  progress = progress + wheelProgress
  animate()
}

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

const handleMouseDown = e => {
  isDown = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
  isDown = false
}


function togglePlay() {
  const video = document.getElementById('videoPlayer');
  const playButton = document.getElementById('playButton');

  if (video.style.display === 'none') {
      video.style.display = 'block'; // Show video
      playButton.style.display = 'none'; // Hide button
      video.src += "?autoplay=1"; // Autoplay video
  }
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)



//carosule team logic

 const teamMembers = [
	{ name: "Luffy", role: "Founder" },
	{ name: "Monkey D. Luffy", role: "Creative Director" },
	{ name: "Luffy chan", role: "Lead Developer" },
	{ name: "Lucy", role: "UX Designer" },
	{ name: "Luffy kun", role: "Marketing Manager" },
	{ name: "Monkey chan", role: "Product Manager" }
];

const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const memberName = document.querySelector(".member-name");
const memberRole = document.querySelector(".member-role");
const upArrows = document.querySelectorAll(".nav-arrow.up");
const downArrows = document.querySelectorAll(".nav-arrow.down");
let currentIndex = 0;
let isAnimating = false;

function updateCarousel(newIndex) {
	if (isAnimating) return;
	isAnimating = true;

	currentIndex = (newIndex + cards.length) % cards.length;

	cards.forEach((card, i) => {
		const offset = (i - currentIndex + cards.length) % cards.length;

		card.classList.remove(
			"center",
			"up-1",
			"up-2",
			"down-1",
			"down-2",
			"hidden"
		);

		if (offset === 0) {
			card.classList.add("center");
		} else if (offset === 1) {
			card.classList.add("down-1");
		} else if (offset === 2) {
			card.classList.add("down-2");
		} else if (offset === cards.length - 1) {
			card.classList.add("up-1");
		} else if (offset === cards.length - 2) {
			card.classList.add("up-2");
		} else {
			card.classList.add("hidden");
		}
	});

	dots.forEach((dot, i) => {
		dot.classList.toggle("active", i === currentIndex);
	});

	memberName.style.opacity = "0";
	memberRole.style.opacity = "0";

	setTimeout(() => {
		memberName.textContent = teamMembers[currentIndex].name;
		memberRole.textContent = teamMembers[currentIndex].role;
		memberName.style.opacity = "1";
		memberRole.style.opacity = "1";
	}, 300);

	setTimeout(() => {
		isAnimating = false;
	}, 800);
}

upArrows.forEach(arrow => {
	arrow.addEventListener("click", () => {
		updateCarousel(currentIndex - 1);
	});
});

downArrows.forEach(arrow => {
	arrow.addEventListener("click", () => {
		updateCarousel(currentIndex + 1);
	});
});

dots.forEach((dot, i) => {
	dot.addEventListener("click", () => {
		updateCarousel(i);
	});
});

cards.forEach((card, i) => {
	card.addEventListener("click", () => {
		updateCarousel(i);
	});
});

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowUp") {
		updateCarousel(currentIndex - 1);
	} else if (e.key === "ArrowDown") {
		updateCarousel(currentIndex + 1);
	}
});

let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
	touchStartY = e.changedTouches[0].screenY;
	stopAutoRotate();
});

document.addEventListener("touchend", (e) => {
	touchEndY = e.changedTouches[0].screenY;
	handleSwipe();
	startAutoRotate();
});

function handleSwipe() {
	const swipeThreshold = 50;
	const diff = touchStartY - touchEndY;
	if (Math.abs(diff) > swipeThreshold) {
		if (diff > 0) updateCarousel(currentIndex + 1);
		else updateCarousel(currentIndex - 1);
	}
}

// Auto-rotate logic
let autoRotateInterval = null;
const AUTO_ROTATE_DELAY = 2000; // 4 seconds

function startAutoRotate() {
	stopAutoRotate();
	autoRotateInterval = setInterval(() => {
		updateCarousel(currentIndex + 1);
	}, AUTO_ROTATE_DELAY);
}

function stopAutoRotate() {
	if (autoRotateInterval) {
		clearInterval(autoRotateInterval);
		autoRotateInterval = null;
	}
}

function resetAutoRotate() {
	stopAutoRotate();
	startAutoRotate();
}

// Pause on hover and resume on leave
const carouselContainerEl = document.querySelector('.carousel-container');
if (carouselContainerEl) {
	carouselContainerEl.addEventListener('mouseenter', stopAutoRotate);
	carouselContainerEl.addEventListener('mouseleave', startAutoRotate);
}

// Reset timer on user interactions
dots.forEach(d => d.addEventListener('click', resetAutoRotate));
cards.forEach(c => c.addEventListener('click', resetAutoRotate));
upArrows.forEach(a => a.addEventListener('click', resetAutoRotate));
downArrows.forEach(a => a.addEventListener('click', resetAutoRotate));
document.addEventListener('keydown', resetAutoRotate);

updateCarousel(0);
startAutoRotate();


