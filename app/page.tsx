export default function Home() {
  const tools = [
    {
      title: "Fleet Management",
      description: "Monitor and manage vehicle fleet operations in real-time",
      icon: "🚗",
      href: "/fleet-management"
    },
    {
      title: "Route Optimization",
      description: "Optimize routes for efficient mobility solutions",
      icon: "🗺️",
      href: "/route-optimization"
    },
    {
      title: "Driver Portal",
      description: "Driver onboarding, scheduling, and performance tracking",
      icon: "👤",
      href: "/driver-portal"
    },
    {
      title: "Analytics Dashboard",
      description: "Real-time analytics and reporting for mobility insights",
      icon: "📊",
      href: "/analytics"
    },
    {
      title: "Customer Service",
      description: "Manage customer inquiries and support tickets",
      icon: "💬",
      href: "/customer-service"
    },
    {
      title: "Billing & Payments",
      description: "Handle invoicing, payments, and financial records",
      icon: "💳",
      href: "/billing"
    },
    {
      title: "Maintenance Scheduler",
      description: "Schedule and track vehicle maintenance operations",
      icon: "🔧",
      href: "/maintenance"
    },
    {
      title: "Reporting Tools",
      description: "Generate custom reports and export data",
      icon: "📈",
      href: "/reporting"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="header-container">
        <div className="header-content">
          <div className="logo-wrapper">
            <div className="logo-icon">A</div>
            <div className="logo-text-wrapper">
              <h1 className="logo-title">Arrive</h1>
              <p className="logo-subtitle">Mobility Solutions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="content-wrapper">
          <div className="page-header">
            <h2 className="page-title">Internal Tools</h2>
            <p className="page-description">
              Access all your Arrive mobility management tools in one place
            </p>
          </div>

          <div className="tools-grid">
            {tools.map((tool) => (
              <a
                key={tool.title}
                href={tool.href}
                className="tool-card"
              >
                <div className="tool-icon">{tool.icon}</div>
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
                <div className="tool-arrow">→</div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
