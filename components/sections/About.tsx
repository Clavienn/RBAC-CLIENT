import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div id='apropos'></div>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">
          À propos
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Fournir des solutions innovantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Être leader dans notre domaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Excellence et satisfaction client
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}