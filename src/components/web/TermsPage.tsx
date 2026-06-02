import { LegalPage } from "./LegalPage";

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="June 2, 2026"
      intro={
        <>
          These Terms of Service ("Terms") govern your access to and use of the Buildafr
          construction operating system provided by Buildafr Technologies Ltd ("Buildafr",
          "we", "us"). By creating an account or using the platform, you agree to these Terms.
          If you are using Buildafr on behalf of an organisation, you confirm that you are
          authorised to bind that organisation to these Terms.
        </>
      }
      sections={[
        {
          heading: "The Service",
          body: (
            <>
              Buildafr provides a web dashboard, mobile field application, and client visibility
              portal for managing construction projects — including attendance, daily reports,
              geo-tagged photos, material tracking, task management, analytics, and related
              features. We may add, change, or remove features over time to improve the service.
            </>
          ),
        },
        {
          heading: "Accounts and Eligibility",
          body: (
            <>
              You must provide accurate account information and keep it up to date. You are
              responsible for maintaining the confidentiality of your login credentials and for
              all activity under your account. You must be at least 18 years old to use Buildafr.
              Notify us promptly of any unauthorised use of your account.
            </>
          ),
        },
        {
          heading: "Subscriptions and Payment",
          body: (
            <>
              Paid plans are billed in advance on the cycle described at sign-up (for example, the
              Starter and Growth monthly plans, or a custom Enterprise agreement). Unless stated
              otherwise, fees are non-refundable. We may change pricing on renewal with reasonable
              notice. Failure to pay may result in suspension or termination of access.
            </>
          ),
        },
        {
          heading: "Acceptable Use",
          body: (
            <>
              You agree not to misuse the service. In particular, you may not:
              <ul style={listStyle}>
                <li>upload unlawful, infringing, or harmful content;</li>
                <li>attempt to access accounts, data, or systems you are not authorised to use;</li>
                <li>interfere with, disrupt, or reverse-engineer the platform;</li>
                <li>submit false attendance, location, or project records; or</li>
                <li>use the service to violate any applicable law or third-party rights.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Your Data and Content",
          body: (
            <>
              You retain ownership of the project data, reports, and media you submit ("Your
              Content"). You grant us a limited licence to host, process, and display Your Content
              solely to provide and improve the service. Our handling of personal information is
              described in our{" "}
              <a href="/privacy" style={linkStyle}>Privacy Policy</a>. You are responsible for
              ensuring you have the rights and consents needed to submit Your Content, including
              photos and location data of personnel.
            </>
          ),
        },
        {
          heading: "Intellectual Property",
          body: (
            <>
              The Buildafr platform, including its software, design, and branding, is owned by
              Buildafr Technologies Ltd and protected by intellectual property laws. These Terms
              do not grant you any rights in our intellectual property except the limited right to
              use the service as permitted here.
            </>
          ),
        },
        {
          heading: "Service Availability",
          body: (
            <>
              We work to keep the service available and reliable, but we do not guarantee
              uninterrupted or error-free operation. We may perform maintenance, and we may
              suspend access where necessary to protect the platform, our users, or to comply with
              the law.
            </>
          ),
        },
        {
          heading: "Disclaimers and Limitation of Liability",
          body: (
            <>
              The service is provided "as is" without warranties of any kind, to the fullest
              extent permitted by law. Buildafr is a management and visibility tool and does not
              replace professional engineering, safety, or legal judgement. To the maximum extent
              permitted by law, Buildafr will not be liable for indirect or consequential losses,
              and our total liability arising from the service will not exceed the fees you paid in
              the twelve months preceding the claim.
            </>
          ),
        },
        {
          heading: "Termination",
          body: (
            <>
              You may stop using the service and close your account at any time. We may suspend or
              terminate access if you breach these Terms or use the service in a way that may harm
              Buildafr or others. On termination, your right to use the service ends, and we will
              handle any remaining data in accordance with our Privacy Policy.
            </>
          ),
        },
        {
          heading: "Changes to These Terms",
          body: (
            <>
              We may update these Terms from time to time. When we make material changes, we will
              update the "Last updated" date above and, where appropriate, notify you within the
              platform. Continued use of the service after changes take effect constitutes
              acceptance of the updated Terms.
            </>
          ),
        },
        {
          heading: "Contact Us",
          body: (
            <>
              Questions about these Terms can be sent to{" "}
              <a href="mailto:legal@buildafr.com" style={linkStyle}>legal@buildafr.com</a>.
            </>
          ),
        },
      ]}
    />
  );
}

const listStyle: React.CSSProperties = {
  margin: "12px 0 0",
  paddingLeft: 22,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const linkStyle: React.CSSProperties = {
  color: "#B45309",
  textDecoration: "none",
  fontWeight: 600,
};
