import { WorkspaceShell } from "@/components/workspace-shell";
import { SectionShell } from "@/components/section-shell";
import { ContactField } from "@/components/contact-field";
import { MetadataPanel } from "@/components/metadata-panel";
import { InspectorSection } from "@/components/inspector-section";
import { PanelShell } from "@/components/panel-shell";

export default function ContactPage() {
  return (
    <WorkspaceShell activeTab="Contact">
      <SectionShell label="Final Export">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <PanelShell title="Render Queue" meta="EXPORT" status="READY">
            <form className="space-y-4">
              <div>
                <h1 className="text-3xl font-semibold">Project Inquiry</h1>
                <p className="mt-2 text-sm text-ink-muted">
                  Share your project scope, timeline, and desired outcomes. We
                  respond within 48 hours.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ContactField label="Name" name="name" placeholder="Your name" />
                <ContactField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@studio.com"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ContactField
                  label="Project Type"
                  name="projectType"
                  type="select"
                  options={[
                    "Commercial",
                    "Documentary",
                    "Music Video",
                    "Branded Film",
                    "Fashion",
                    "Short Film"
                  ]}
                />
                <ContactField
                  label="Budget Range"
                  name="budget"
                  type="select"
                  options={["25-50K", "50-100K", "100-250K", "250K+"]}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ContactField
                  label="Timeline"
                  name="timeline"
                  type="select"
                  options={["2-4 Weeks", "1-2 Months", "3+ Months"]}
                />
                <ContactField
                  label="Availability"
                  name="availability"
                  type="select"
                  options={["Immediate", "Next Quarter", "Flexible"]}
                />
              </div>
              <ContactField
                label="Message"
                name="message"
                type="textarea"
                placeholder="Describe the story, audience, and visual tone."
              />
              <button
                type="submit"
                className="w-full border border-cyan bg-cyan/10 px-4 py-3 text-xs uppercase tracking-[0.2em]"
              >
                Send Inquiry
              </button>
            </form>
          </PanelShell>
          <div className="space-y-4">
            <MetadataPanel
              title="Contact"
              items={[
                { label: "Studio", value: "hello@thebricks.studio" },
                { label: "Production", value: "+1 (323) 555-0184" },
                { label: "Location", value: "Los Angeles, CA" }
              ]}
            />
            <InspectorSection title="Delivery">
              <p>
                Provide project goals, references, and any existing footage. We
                will prepare a tailored treatment and production estimate.
              </p>
            </InspectorSection>
            <InspectorSection title="Booking Window">
              <p>Current availability: September through December.</p>
            </InspectorSection>
          </div>
        </div>
      </SectionShell>
    </WorkspaceShell>
  );
}
