import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | BrandVoice.AI',
  description: 'Privacy Policy for BrandVoice.AI services provided by Eula Properties LLC',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 4, 2024';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-purple-100">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Eula Properties LLC</strong>, operating as <strong>BrandVoice.AI</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We may collect personal information that you voluntarily provide, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Business name and website</li>
              <li>Billing and payment information</li>
              <li>Account credentials</li>
              <li>Voice samples (for voice cloning services)</li>
              <li>Brand assets and content you provide for video production</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages viewed and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Click patterns and navigation paths</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Create your custom AI spokesperson and videos</li>
              <li>Process payments and manage your account</li>
              <li>Communicate with you about your orders and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Analyze usage patterns to improve our website</li>
              <li>Protect against fraud and unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience. These include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can manage your cookie preferences through our cookie consent banner or your browser settings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Service Providers:</strong> Third parties who help us operate our business (payment processors, cloud hosting, AI technology providers)</li>
              <li><strong>Business Partners:</strong> With your consent, for joint offerings</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted storage for sensitive data</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Active account data: Duration of your account plus 2 years</li>
              <li>Video deliverables: Stored in your portal for ongoing access</li>
              <li>Voice samples: Retained as long as needed for your service, then deleted upon request</li>
              <li>Payment records: As required by tax and accounting laws</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@brandvoice.ai" className="text-purple-600 hover:text-purple-700">privacy@brandvoice.ai</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to say no to the sale of personal information</li>
              <li>Right to equal service and price</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell personal information as defined by the CCPA.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete that information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="text-gray-700"><strong>Eula Properties LLC</strong></p>
              <p className="text-gray-700">Operating as BrandVoice.AI</p>
              <p className="text-gray-700 mt-2">
                Privacy Inquiries: <a href="mailto:privacy@brandvoice.ai" className="text-purple-600 hover:text-purple-700">privacy@brandvoice.ai</a>
              </p>
              <p className="text-gray-700">
                General Support: <a href="mailto:support@brandvoice.ai" className="text-purple-600 hover:text-purple-700">support@brandvoice.ai</a>
              </p>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
