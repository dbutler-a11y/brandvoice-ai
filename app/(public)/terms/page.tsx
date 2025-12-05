import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | BrandVoice.AI',
  description: 'Terms of Service for BrandVoice.AI services provided by Eula Properties LLC',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'December 4, 2024';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-purple-100">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and <strong>Eula Properties LLC</strong>, operating as <strong>BrandVoice.AI</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the BrandVoice.AI website and services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Description</h2>
            <p className="text-gray-700 leading-relaxed">
              BrandVoice.AI provides done-for-you AI spokesperson video production services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Custom AI spokesperson avatar creation</li>
              <li>Professional script writing</li>
              <li>Video production and editing</li>
              <li>Voice cloning services</li>
              <li>Multi-language dubbing</li>
              <li>Client portal access for video management</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-700 leading-relaxed">
              To access certain features of our services, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>4.1 Pricing:</strong> All prices are listed in US Dollars (USD) and are subject to change. Current pricing is displayed on our website at the time of purchase.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>4.2 Payment Processing:</strong> Payments are processed securely through PayPal. By making a purchase, you agree to PayPal&apos;s terms of service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>4.3 Subscriptions:</strong> For monthly subscription packages, you authorize us to charge your payment method on a recurring basis until you cancel. The Content Engine Monthly package requires a 3-month minimum commitment.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>4.4 Refund Policy:</strong> Due to the custom nature of our AI spokesperson creation and the significant work involved in scripting and production, we do not offer refunds once production has started. We include revision rounds to ensure your satisfaction.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>5.1 Your Content:</strong> You retain all rights to the content and information you provide to us (brand guidelines, business information, etc.).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>5.2 Deliverables:</strong> Upon full payment, you receive full commercial usage rights to the videos we create for you. You may use the videos for organic posts, paid advertising, email marketing, website content, and any other business purpose.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>5.3 Our Technology:</strong> The AI technology, methods, and systems used to create your content remain the exclusive property of BrandVoice.AI and its technology partners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree not to use our services to create content that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Is illegal, harmful, threatening, abusive, or defamatory</li>
              <li>Infringes on any third party&apos;s intellectual property rights</li>
              <li>Contains false or misleading claims</li>
              <li>Impersonates any person or entity without consent</li>
              <li>Promotes discrimination, hatred, or violence</li>
              <li>Violates any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Delivery and Revisions</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>7.1 Turnaround:</strong> Standard delivery is 7 days from your kickoff call. Rush delivery options are available for an additional fee.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>7.2 Revisions:</strong> Each package includes up to 2 revision rounds per delivery. Additional revisions may be requested for an additional fee.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>7.3 Approval:</strong> Videos are delivered through your client portal. You have 7 days to request revisions after delivery.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Eula Properties LLC and BrandVoice.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of our services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access to our services at any time for violation of these Terms. For subscription services, you may cancel with 30 days notice after any minimum commitment period has ended.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="text-gray-700"><strong>Eula Properties LLC</strong></p>
              <p className="text-gray-700">Operating as BrandVoice.AI</p>
              <p className="text-gray-700 mt-2">
                Email: <a href="mailto:legal@brandvoice.ai" className="text-purple-600 hover:text-purple-700">legal@brandvoice.ai</a>
              </p>
              <p className="text-gray-700">
                Support: <a href="mailto:support@brandvoice.ai" className="text-purple-600 hover:text-purple-700">support@brandvoice.ai</a>
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
