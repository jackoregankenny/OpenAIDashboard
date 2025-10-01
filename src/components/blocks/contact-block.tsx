import { ContactBlockProps } from '@/lib/blocks/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail } from 'lucide-react';
import { registerBlock } from '@/lib/blocks/registry';

export function ContactBlock({ 
  title, 
  address, 
  phone, 
  email, 
  mapUrl,
  showForm = true 
}: ContactBlockProps) {
  return (
    <div className="px-6 py-12 md:px-12 bg-muted/30">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {address && (
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href={`tel:${phone}`} className="text-sm text-blue-600 hover:underline">{phone}</a>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href={`mailto:${email}`} className="text-sm text-blue-600 hover:underline">{email}</a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {mapUrl && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" rows={5} />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'contact',
  name: 'Contact Section',
  description: 'Contact information and form',
  component: ContactBlock,
  defaultProps: {
    title: 'Contact Us',
    showForm: true,
  },
  icon: 'mail',
  category: 'interactive',
});

