import { LegalPage } from "./LegalPage";

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 2, 2026"
      intro={
        <>
          Buildafr Technologies Ltd ("Buildafr", "we", "us") operates the Buildafr
          construction operating system — a web dashboard, mobile field application, and
          client visibility portal. This Privacy Policy explains what information we collect,
          how we use it, and the choices you have. By using our services you agree to the
          practices described below.
        </>
      }
      sections={[
        {
          heading: "Information We Collect",
          body: (
            <>
              We collect information you provide directly and information generated through
              normal use of the platform, including:
              <ul style={listStyle}>
                <li>
                  <strong>Account details</strong> — name, email address, phone number,
                  company, and role (e.g. project manager, supervisor, contractor).
                </li>
                <li>
                  <strong>Project and operational data</strong> — sites, tasks, daily reports,
                  material logs, and financial records you enter.
                </li>
                <li>
                  <strong>Location data</strong> — GPS coordinates used for attendance
                  check-in/out and to geo-tag site photos, captured only while you use the
                  relevant features.
                </li>
                <li>
                  <strong>Media</strong> — photos and documents you upload, along with
                  timestamps and the identity of the user who captured them.
                </li>
                <li>
                  <strong>Device and usage data</strong> — device type, app version, log data,
                  and basic analytics used to keep the service reliable and secure.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How We Use Your Information",
          body: (
            <>
              We use the information to provide and operate the platform — recording
              attendance, syncing field reports, tracking materials and tasks, generating
              analytics and AI delay predictions, and delivering notifications by push, email,
              SMS, or WhatsApp. We also use it to secure the service, prevent fraud and
              material leakage, provide support, and comply with our legal obligations.
            </>
          ),
        },
        {
          heading: "How We Share Information",
          body: (
            <>
              Project data is visible to authorised members of your organisation according to
              their assigned roles and permissions. We do not sell your personal information.
              We share data only with service providers that help us operate the platform
              (such as cloud hosting, storage, messaging, and analytics providers) under
              appropriate confidentiality obligations, or where required by law.
            </>
          ),
        },
        {
          heading: "Data Storage and Security",
          body: (
            <>
              Your data is stored on secured cloud infrastructure. We use encryption in transit,
              access controls, and role-based permissions to protect it. The mobile app supports
              offline capture with local caching that syncs to our servers once a connection is
              available. While no system is perfectly secure, we work to protect your information
              using industry-standard safeguards.
            </>
          ),
        },
        {
          heading: "Data Retention",
          body: (
            <>
              We retain your information for as long as your account is active or as needed to
              provide the service, and afterwards as required to meet legal, accounting, or
              reporting obligations. You may request deletion of your data as described below,
              subject to those obligations.
            </>
          ),
        },
        {
          heading: "Your Rights",
          body: (
            <>
              Depending on your jurisdiction, you may have the right to access, correct, export,
              or delete your personal information, and to object to or restrict certain
              processing. To exercise these rights, contact us using the details below. If your
              data is managed within an employer's organisation account, we may direct your
              request to that organisation.
            </>
          ),
        },
        {
          heading: "Children's Privacy",
          body: (
            <>
              Buildafr is a business tool and is not directed to children under 18. We do not
              knowingly collect personal information from children.
            </>
          ),
        },
        {
          heading: "Changes to This Policy",
          body: (
            <>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              "Last updated" date above and, where appropriate, notify you within the platform.
            </>
          ),
        },
        {
          heading: "Contact Us",
          body: (
            <>
              If you have questions about this Privacy Policy or how we handle your data, contact
              us at <a href="mailto:privacy@buildafr.com" style={linkStyle}>privacy@buildafr.com</a>.
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
