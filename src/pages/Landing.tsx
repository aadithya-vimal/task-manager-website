import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { CheckCircle2, Zap, Shield, Sparkles, ArrowRight, ListTodo } from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle2,
      title: "Task Management",
      description: "Create, update, and organize your tasks with ease",
      color: "#00ff88",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "See changes instantly across all your devices",
      color: "#0088ff",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected",
      color: "#ff0080",
    },
    {
      icon: Sparkles,
      title: "Smart Filtering",
      description: "Filter and search tasks to find what you need",
      color: "#00ff88",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0088ff]/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-[#ff0080]/10 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 border-b border-[#222222] bg-[#111111]/80 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#0088ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.5)]">
                <ListTodo className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold">Task Manager</span>
            </div>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_20px_rgba(0,255,136,0.3)] font-semibold"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-[#00ff88]/30 mb-8 shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <Sparkles className="h-4 w-4 text-[#00ff88]" />
              <span className="text-sm text-gray-300">Manage tasks like a pro</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] bg-clip-text text-transparent">
                Organize Your Life
              </span>
              <br />
              <span className="text-white">One Task at a Time</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A powerful task management application with real-time updates, smart filtering,
              and a beautiful dark interface designed for productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                size="lg"
                className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_30px_rgba(0,255,136,0.4)] text-lg font-semibold px-8"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
                size="lg"
                variant="outline"
                className="bg-transparent border-[#333333] text-white hover:bg-[#222222] hover:text-white text-lg px-8"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#00ff88] to-[#0088ff] bg-clip-text text-transparent">
              Stay Organized
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to help you manage tasks efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#111111] border border-[#222222] rounded-xl p-6 hover:border-[#00ff88]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] group"
            >
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: `${feature.color}20`,
                  boxShadow: `0 0 20px ${feature.color}30`,
                }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#00ff88]/10 via-[#0088ff]/10 to-[#ff0080]/10 border border-[#222222] rounded-2xl p-12 shadow-[0_0_50px_rgba(0,255,136,0.1)]"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get{" "}
            <span className="bg-gradient-to-r from-[#00ff88] to-[#0088ff] bg-clip-text text-transparent">
              Organized?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are managing their tasks efficiently with our platform.
          </p>
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            size="lg"
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_30px_rgba(0,255,136,0.4)] text-lg font-semibold px-8"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#222222] bg-[#111111]/80 backdrop-blur-lg py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>
            © 2025 Aadithya Vimal
          </p>
        </div>
      </footer>
    </div>
  );
}