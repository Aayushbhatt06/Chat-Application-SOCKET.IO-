import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  Zap,
  Database,
  Lock,
  Send,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatAppLanding = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-10 h-10" />,
      title: "Real-Time Messaging",
      description:
        "Send and receive messages instantly with Socket.io. No delays, no refresh needed. Experience true real-time communication.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Connection System",
      description:
        "Send connection requests to other users. Only chat with accepted connections. Build your trusted network.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <Database className="w-10 h-10" />,
      title: "Chat History",
      description:
        "All your messages are safely stored in MongoDB. Access your conversation history anytime. Never lose important chats.",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Lightning Fast",
      description:
        "Built with modern MERN stack for optimal performance. WebSockets ensure instant message delivery.",
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      icon: <Lock className="w-10 h-10" />,
      title: "Secure & Private",
      description:
        "Your conversations are private. Only you and your connections can see your messages. End-to-end security.",
      gradient: "from-red-500 to-pink-600",
    },
    {
      icon: <Send className="w-10 h-10" />,
      title: "Simple Interface",
      description:
        "Clean, intuitive design. Focus on what matters - your conversations. Easy to use for everyone.",
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account in seconds",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      step: "2",
      title: "Connect",
      description: "Send connection requests to users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "3",
      title: "Chat",
      description: "Start messaging your connections",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      step: "4",
      title: "Enjoy",
      description: "Real-time conversations, saved forever",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  const benefits = [
    "✓ Real-time message delivery with Socket.io",
    "✓ Connection request & acceptance system",
    "✓ One-on-one private conversations",
    "✓ Complete chat history in MongoDB",
    "✓ Online/offline user status",
    "✓ Message read receipts",
    "✓ Typing indicators",
    "✓ Mobile responsive design",
  ];

  const techStack = [
    { name: "MongoDB", emoji: "🍃", color: "text-green-400" },
    { name: "Express", emoji: "🚀", color: "text-blue-400" },
    { name: "React", emoji: "⚛️", color: "text-cyan-400" },
    { name: "Node.js", emoji: "🟢", color: "text-green-400" },
    { name: "Socket.io", emoji: "⚡", color: "text-yellow-400" },
    { name: "Tailwind", emoji: "🎨", color: "text-cyan-400" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setShowMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                ChatConnect
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-blue-600 transition text-sm font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 hover:text-blue-600 transition text-sm font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("tech")}
                className="text-gray-700 hover:text-blue-600 transition text-sm font-medium"
              >
                Technology
              </button>
              <button
                onClick={() => {
                  navigate("/home");
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {showMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 mt-2 pt-4">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("tech")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Technology
              </button>
              <button
                onClick={() => {
                  navigate("/home");
                }}
                className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold mt-2"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Chat in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real-Time
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Connect with friends, send messages instantly, and never lose a
              conversation. Built with Socket.io and MERN stack for the fastest
              messaging experience.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-blue-600">⚡</div>
                <div className="text-sm text-gray-600 mt-1">
                  Instant Delivery
                </div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-purple-600">🔒</div>
                <div className="text-sm text-gray-600 mt-1">100% Private</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-green-600">💾</div>
                <div className="text-sm text-gray-600 mt-1">Saved Forever</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2">
                Start Chatting <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete real-time messaging solution with all essential
              features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose ChatConnect?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built with modern technologies to provide the best messaging
                experience. Fast, reliable, and secure.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                {/* Mock Chat Interface */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-100 rounded-2xl rounded-tl-none px-4 py-3">
                      <p className="text-gray-900">Hey! How are you?</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-3">
                      <p>I'm great! This app is amazing!</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Just now • Read
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-100 rounded-2xl rounded-tl-none px-4 py-3">
                      <p className="text-gray-900">
                        Right? Real-time is so fast! ⚡
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                  <button className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                )}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl text-white">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section
        id="tech"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Built with MERN Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern, powerful technologies for the best performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all transform hover:scale-110 border border-gray-100"
              >
                <div className="text-5xl mb-4">{tech.emoji}</div>
                <h4 className={`${tech.color} font-bold text-lg`}>
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Connecting Today
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of users already chatting in real-time
          </p>
          <button
            onClick={() => {
              navigate("/home");
            }}
            className="inline-flex items-center gap-3 bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105"
          >
            Get Started Free <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ChatConnect</span>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Built with Socket.io, MERN Stack & Tailwind CSS
              <br />
              &copy; 2026 ChatConnect. Real-time messaging made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatAppLanding;
