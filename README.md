# HR Support Chat

**A conversation/chat plugin for WordPress that allows businesses to interact with HR advisors in real time.**

Built with React, Tailwind CSS, and the WordPress REST API, this plugin enables anonymous or identified business users to create support cases and chat directly with assigned HR advisors.

---

## 🔧 Features

- **Token-based anonymous access**
- **Named conversation mode** (email + first name)
- **Live chat UI** inspired by ChatGPT
- **Persistent chat sessions** via local storage
- **WP admin case management** for HR advisors
- **Status tracking**: Open, Ongoing, Closed
- **Role-based access** (`hr_advisor`)
- **Custom post type + comments** as messages
- **React + Tailwind frontend** with `wp-scripts` build system

---

## 📁 File Structure

```
hr-support-chat/
├── assets/js/             # React components, contexts, hooks
├── includes/              # PHP logic: REST API, CPT, roles
├── templates/             # Page template
├── hr-support-chat.php    # Main plugin loader
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
```

---

## 🚀 Installation

1. Clone or download this repository into your `wp-content/plugins/` folder.
2. Run:
   ```bash
   npm install
   npm run build
   ```
3. Activate the plugin in WordPress.
4. Create a page and assign the **"HR Support Chat"** page template.
5. That page will render the React-powered chat UI.

---

## 🔑 Roles & Access

| Role              | Capability                                      |
| ----------------- | ----------------------------------------------- |
| `hr_advisor`      | Can view and reply to all support cases         |
| Anonymous / Users | Can view their own chat via token or email+name |

---

## 🛡 Security

- All REST endpoints require a valid access token or email+name match.
- Rate limiting is enforced on message submission.
- Honeypot field is used to prevent bot spam.
- Sanitization and escaping are used throughout.

---

## 🧪 Development

Uses `@wordpress/scripts` for build tooling:

```bash
npm run build         # Build production assets
npm run start         # Start development watch
```

---

## 📦 Extending

- Add custom fields or metadata to support cases
- Add email or Slack notifications to HR advisors
- Style chat bubbles with avatars or colors
- Enable file uploads or emoji reactions

---

## 📄 License

GPLv2 or later

---

**Made with ❤️ by [WP Plugin Architect](https://chatgpt.com/g/g-6cqBCrKTn-wp-plugin-architect)**
