import { getAllWidgets } from '@/lib/registry/generated';

export default function Home() {
  const widgets = getAllWidgets();

  return (
    <main className="min-h-screen">
      {/* Demo Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            EdTech School Website Builder
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Self-registering component system demo - {widgets.length} components loaded
          </p>
          <div className="flex gap-4">
            <a
              href="/editor/demo"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              🎨 Open Editor Demo
            </a>
            <a
              href="/preview/demo"
              className="inline-block bg-white/20 backdrop-blur text-white border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              👁️ View Published Preview
            </a>
          </div>
        </div>
      </div>

      {/* Component Registry Demo */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8">Registered Components</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {widgets.map(({ config }) => (
            <div
              key={config.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {config.icon.slice(0, 2)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{config.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {config.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                  {config.category}
                </span>
                {config.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Component Demo */}
        <h2 className="text-3xl font-bold mb-8">Live Component Preview</h2>
        <div className="space-y-8 border rounded-lg overflow-hidden">
          {widgets.map(({ config, component: Component }) => (
            <div key={config.id} className="border-b last:border-b-0">
              <div className="bg-gray-50 px-4 py-2 font-mono text-sm text-gray-600">
                {config.id}
              </div>
              <Component props={{}} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


