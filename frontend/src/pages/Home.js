import React, { useEffect, useRef, useState } from "react";
import "./Home.css";

function Home({ enterDashboard }) {
  const canvasRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);

   // For Login form data
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // For Error message
  const [error, setError] = useState("");

  const handleInput = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const users = [
    { username: "admin", password: "12345" },
    { username: "Admin", password: "admin1"},
  ];


  const handleLogin = () => {
    const foundUser = users.find(
      (u) =>
        u.username === loginData.username &&
        u.password === loginData.password
    );

    if (foundUser) {
        setError("");
        enterDashboard(); // login success
      } 
    else {
        setError("Invalid username or password");
    }
};


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    const mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // For Moving particles
        p.x += p.speedX;
        p.y += p.speedY;

        // For Wrap around edges
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        // To Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();

        // To Draw the line to mouse if close
        if (mouse.x && mouse.y) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="home-container">
      {/* Canvas for cursor tracking */}
      <canvas ref={canvasRef} className="cursor-canvas"></canvas>

      {/* Parallax Star Layers */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Gradient Waves */}
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
      
      {/* Main content */}
      <div className="home-content">
        <h1 className="home-title tracking-in-contract-bck"> Mini Admin App</h1>
        <button className="home-button" onClick={() => setShowLogin(true)}>
        Enter Dashboard
        </button>
      </div>

      {/* For Sliding Login Panel */}
        <div className={`login-panel ${showLogin ? "open" : ""}`}>
          <div className="login-box">
            <h2>Login</h2>

            <input type="text" placeholder="Username" name="username" onChange={handleInput} />
            <input type="password" placeholder="Password" name="password" onChange={handleInput} />

      {/* Error message */}
      {error && <p className="error-text">{error}</p>}

      <button className="login-submit" onClick={handleLogin}>
      Login
      </button>

      <button className="close-btn" onClick={() => setShowLogin(false)}>
        Close
      </button>
      </div>
    </div>
    </div>
  );
}

export default Home;
