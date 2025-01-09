##Follow the cursor rules.

```
src
├── actions
│   ├── api-key.ts
│   ├── upload.ts
│   └── user.ts
├── app
│   ├── (auth)
│   │   └── layout.tsx
│   ├── (site)
│   │   ├── admin
│   │   │   ├── account-settings
│   │   │   │   └── page.tsx
│   │   │   ├── ai-integration
│   │   │   │   └── page.tsx
│   │   │   ├── api
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── manage-users
│   │   │   │   ├── ManageUsersClient.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── send-newsletter
│   │   │   │   └── page.tsx
│   │   │   └── settings
│   │   │       └── page.tsx
│   │   ├── auth
│   │   │   ├── no-invitation
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password
│   │   │   │   └── [token]
│   │   │   │       └── page.tsx
│   │   │   └── signup
│   │   ├── dashboard
│   │   │   ├── page.tsx
│   │   │   └── settings
│   │   │       └── page.tsx
│   │   ├── error
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   ├── support
│   │   │   └── page.tsx
│   │   ├── thank-you
│   │   │   └── page.tsx
│   │   └── user
│   │       ├── api
│   │       │   └── page.tsx
│   │       ├── billing
│   │       │   └── page.tsx
│   │       ├── invoice
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── settings
│   ├── api
│   │   ├── admin
│   │   │   └── invitations
│   │   │       └── route.ts
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   │   └── route.ts
│   │   │   ├── check-email-access
│   │   │   │   └── route.ts
│   │   │   └── check-invitation
│   │   │       └── route.ts
│   │   ├── health
│   │   │   └── route.ts
│   │   ├── stripe
│   │   │   ├── create-checkout-session
│   │   │   ├── manage-subscription
│   │   │   ├── multi-payment
│   │   │   ├── payment
│   │   │   │   └── route.ts
│   │   │   └── webhook
│   │   │       └── route.ts
│   │   ├── test-env
│   │   └── user
│   │       ├── fetch-user
│   │       │   └── route.ts
│   │       ├── invite
│   │       │   ├── check
│   │       │   │   └── route.ts
│   │       │   └── verify
│   │       │       └── route.ts
│   │       └── setup-password
│   │           └── route.ts
│   ├── auth
│   │   ├── error
│   │   │   └── page.tsx
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── invite
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── signin
│   │   │   └── page.tsx
│   │   └── verify-request
│   │       └── page.tsx
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── favicon.ico
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components
│   ├── 404
│   │   └── index.tsx
│   ├── Admin
│   │   ├── AiIntegration
│   │   │   ├── InputCard.tsx
│   │   │   ├── OutputCard.tsx
│   │   │   ├── SetApiKeyCard.tsx
│   │   │   ├── SetApiKeyModal.tsx
│   │   │   └── index.tsx
│   │   ├── Dashboard
│   │   │   ├── ChartOne.tsx
│   │   │   ├── DataStatsCard.tsx
│   │   │   └── GraphCard.tsx
│   │   ├── SendNewsletter
│   │   │   └── SendNewsletterCard.tsx
│   │   └── Users
│   │       ├── UserAction.tsx
│   │       ├── UserEmptyState.tsx
│   │       ├── UserListTable.tsx
│   │       ├── UserTopbar.tsx
│   │       └── index.tsx
│   ├── Auth
│   │   ├── ForgotPassword
│   │   │   └── index.tsx
│   │   ├── GoogleSigninButton.tsx
│   │   ├── InvitedSignin
│   │   │   └── index.tsx
│   │   ├── InvitedUserSignIn
│   │   │   └── index.tsx
│   │   ├── NoInvitation.tsx
│   │   ├── ResetPassword
│   │   │   └── index.tsx
│   │   ├── Signin
│   │   │   └── index.tsx
│   │   ├── SigninWithMagicLink.tsx
│   │   ├── SigninWithPassword.tsx
│   │   └── Signup
│   ├── Common
│   │   ├── AccountMenu.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── CopyToClipboard.tsx
│   │   ├── Dashboard
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Editor.tsx
│   │   │   ├── FormButton.tsx
│   │   │   ├── Header
│   │   │   │   ├── AccountButton.tsx
│   │   │   │   ├── ThemeToggler.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── InputGroup.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TextareaGroup.tsx
│   │   ├── FaqSection.tsx
│   │   ├── InputSelect.tsx
│   │   ├── Loader.tsx
│   │   ├── Logo.tsx
│   │   ├── Modals
│   │   │   ├── DeleteModal.tsx
│   │   │   ├── InviteUserModal.tsx
│   │   │   └── ModalCloseButton.tsx
│   │   ├── PreLoader.tsx
│   │   ├── SectionHeader.tsx
│   │   └── SectionTitleH2.tsx
│   ├── Footer
│   │   ├── FooterWrapper.tsx
│   │   └── index.tsx
│   ├── Header
│   │   ├── Account.tsx
│   │   ├── Dropdown.tsx
│   │   ├── HeaderWrapper.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   ├── index.tsx
│   │   └── menuData.ts
│   ├── Home
│   │   ├── CallToAction
│   │   │   └── index.tsx
│   │   ├── Counter
│   │   │   ├── CountUp.tsx
│   │   │   └── index.tsx
│   │   ├── FAQ
│   │   │   ├── FaqItem.tsx
│   │   │   └── index.tsx
│   │   ├── Features
│   │   │   ├── FeatureItem.tsx
│   │   │   ├── featuresData.ts
│   │   │   └── index.tsx
│   │   ├── FeaturesWithImage
│   │   │   ├── FeatureItem.tsx
│   │   │   ├── featuresData.ts
│   │   │   └── index.tsx
│   │   ├── Hero
│   │   │   ├── brandData.tsx
│   │   │   └── index.tsx
│   │   ├── Newsletter
│   │   │   ├── Graphics.tsx
│   │   │   └── index.tsx
│   │   ├── Pricing
│   │   │   └── index.tsx
│   │   ├── Testimonials
│   │   │   ├── TestimonialItem.tsx
│   │   │   ├── index.tsx
│   │   │   └── testmonialsData.ts
│   │   └── index.tsx
│   ├── Layout
│   ├── Sidebar
│   ├── Support
│   │   └── index.tsx
│   ├── User
│   │   ├── AccountSettings
│   │   │   ├── DeleteAccount.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   ├── PasswordChange.tsx
│   │   │   ├── SetupPassword.tsx
│   │   │   └── index.tsx
│   │   ├── Api
│   │   │   ├── CreateToken.tsx
│   │   │   ├── TokenList.tsx
│   │   │   └── index.tsx
│   │   ├── Billing
│   │   │   └── index.tsx
│   │   └── PurchaseHistory
│   │       ├── PurchaseEmptyState.tsx
│   │       ├── PurchaseTable.tsx
│   │       └── index.tsx
│   └── ui
├── emails
│   └── InvitationEmail.tsx
├── fonts
│   ├── Satoshi-Black.eot
│   ├── Satoshi-Black.ttf
│   ├── Satoshi-Black.woff
│   ├── Satoshi-Black.woff2
│   ├── Satoshi-BlackItalic.eot
│   ├── Satoshi-BlackItalic.ttf
│   ├── Satoshi-BlackItalic.woff
│   ├── Satoshi-BlackItalic.woff2
│   ├── Satoshi-Bold.eot
│   ├── Satoshi-Bold.ttf
│   ├── Satoshi-Bold.woff
│   ├── Satoshi-Bold.woff2
│   ├── Satoshi-BoldItalic.eot
│   ├── Satoshi-BoldItalic.ttf
│   ├── Satoshi-BoldItalic.woff
│   ├── Satoshi-BoldItalic.woff2
│   ├── Satoshi-Italic.eot
│   ├── Satoshi-Italic.ttf
│   ├── Satoshi-Italic.woff
│   ├── Satoshi-Italic.woff2
│   ├── Satoshi-Light.eot
│   ├── Satoshi-Light.ttf
│   ├── Satoshi-Light.woff
│   ├── Satoshi-Light.woff2
│   ├── Satoshi-LightItalic.eot
│   ├── Satoshi-LightItalic.ttf
│   ├── Satoshi-LightItalic.woff
│   ├── Satoshi-LightItalic.woff2
│   ├── Satoshi-Medium.eot
│   ├── Satoshi-Medium.ttf
│   ├── Satoshi-Medium.woff
│   ├── Satoshi-Medium.woff2
│   ├── Satoshi-MediumItalic.eot
│   ├── Satoshi-MediumItalic.ttf
│   ├── Satoshi-MediumItalic.woff
│   ├── Satoshi-MediumItalic.woff2
│   ├── Satoshi-Regular.eot
│   ├── Satoshi-Regular.ttf
│   ├── Satoshi-Regular.woff
│   ├── Satoshi-Regular.woff2
│   ├── Satoshi-Variable.eot
│   ├── Satoshi-Variable.ttf
│   ├── Satoshi-Variable.woff
│   ├── Satoshi-Variable.woff2
│   ├── Satoshi-VariableItalic.eot
│   ├── Satoshi-VariableItalic.ttf
│   ├── Satoshi-VariableItalic.woff
│   └── Satoshi-VariableItalic.woff2
├── lib
├── libs
│   ├── auth.ts
│   ├── email.ts
│   ├── formatPassword.ts
│   ├── getUpdatedData.ts
│   ├── isAuthorized.ts
│   ├── isValidAPIKey.ts
│   ├── prisma.ts
│   ├── resend.ts
│   ├── scrollActive.js
│   ├── stripe.ts
│   ├── uitls.ts
│   └── validateEmail.ts
├── middleware.ts
├── pricing
│   └── pricingData.ts
├── staticData
│   ├── faqData.tsx
│   ├── sidebarData.tsx
│   ├── statsData.tsx
│   └── userList.tsx
├── stripe
│   ├── StripeBilling
│   │   ├── AnimatedPrice.tsx
│   │   ├── PriceItem.tsx
│   │   └── index.tsx
│   ├── StripeBilling.tsx
│   └── stripe.ts
├── styles
│   ├── globals.css
│   └── satoshi.css
└── types
    ├── faq.ts
    ├── featureItem.ts
    ├── featureWithImg.ts
    ├── menu.ts
    ├── next-auth.d.ts
    ├── priceItem.ts
    ├── sidebar.ts
    └── testimonial.ts

105 directories, 222 files 