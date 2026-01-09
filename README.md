# Pharmacy SOP Generator

![Pharmacy SOP Generator Banner](https://via.placeholder.com/1280x300?text=Pharmacy+SOP+Generator) <!-- Replace with actual banner image if available -->

[![GitHub stars](https://img.shields.io/github/stars/himshim/pharmacy-sop-generator?style=social)](https://github.com/himshim/pharmacy-sop-generator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/himshim/pharmacy-sop-generator?style=social)](https://github.com/himshim/pharmacy-sop-generator/network)
[![GitHub issues](https://img.shields.io/github/issues/himshim/pharmacy-sop-generator)](https://github.com/himshim/pharmacy-sop-generator/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) <!-- Update if license is added -->

## 📋 Description

**Pharmacy SOP Generator** is a lightweight, user-friendly web application designed to create Standard Operating Procedures (SOPs) for instruments and procedures in pharmacy colleges. It ensures compliance with key accreditation standards such as **NAAC**, **NBA**, and **ISO**, making it an essential tool for educators, lab in-charges, and administrators.

Built with vanilla HTML, CSS, and JavaScript, this static app runs entirely in the browser—no server required! Deploy it easily on GitHub Pages or any static host.

Key highlights:
- **Customizable SOPs**: Generate tailored documents with institute details, sections, and authorities.
- **Dual Formats**: Switch between "Inspection" (formal QA-style) and "Beginner" (teaching-friendly) formats.
- **Predefined Templates**: Load ready-made SOPs for common pharmacy instruments (e.g., UV Spectrophotometer).
- **Export to Word**: Copy formatted SOPs directly into Microsoft Word with preserved styling.

Live Demo: [himshim.github.io/pharmacy-sop-generator](https://himshim.github.io/pharmacy-sop-generator/)

## 🚀 Features

- **Modes for Flexibility**:
  - **Beginner Mode**: Simplified for students and new users.
  - **Expert Mode**: Formal structure for inspections and audits.
  - **Custom Mode**: Fully editable for unique procedures.

- **Core Sections**:
  - Purpose, Scope, Responsibility, Procedure (step-by-step), Precautions.
  - Toggle sections on/off as needed.

- **Institute & Authority Customization**:
  - Add institute name, department, and sign-off details (Prepared/Checked/Authorized By).

- **Live Preview**: Real-time rendering of the SOP as you edit.
- **Print-Optimized**: A4 layout with page numbers, headers, and clean formatting for PDFs or prints.
- **Export Functionality**: One-click copy to clipboard in Word-compatible HTML (tables convert seamlessly).
- **Predefined SOPs**: Easily extendable JSON-based templates in `/data/pharmaceutics/`.
- **Responsive Design**: Works on desktop and mobile.
- **No Dependencies**: Pure vanilla JS—fast and lightweight.


## 🛠️ Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/himshim/pharmacy-sop-generator.git
   ```

2. **Navigate to the Project Directory**:
   ```
   cd pharmacy-sop-generator
   ```

3. **Open in Browser**:
   Simply open `index.html` in your favorite web browser. No build steps required!

For production deployment:
- Use GitHub Pages (already configured via `.github/workflows/deploy.yml`).
- Or host on any static server like Vercel, Netlify, or AWS S3.

## 📖 Usage

1. **Select Mode**:
   - Choose Beginner, Expert, or Custom via radio buttons.

2. **Fill Details**:
   - Enter institute info, SOP sections, and authorities.
   - For predefined SOPs, select from the dropdown (add more by creating JSON files in `/data/pharmaceutics/`).

3. **Preview & Edit**:
   - See real-time updates in the "Live SOP Preview" section.
   - Toggle formats with the "Switch SOP Format" button.

4. **Export**:
   - Click "Select SOP (Ctrl + C → Paste in Word)".
   - Paste into Microsoft Word for a formatted document.
   - Print directly from the browser for PDFs.

**Example JSON for Predefined SOP** (e.g., `data/pharmaceutics/uv.json`):
```json
{
  "meta": {
    "title": "Operation of UV Spectrophotometer"
  },
  "sections": {
    "purpose": "To describe the procedure for operating UV Spectrophotometer.",
    "scope": "Applicable to teaching laboratories.",
    "responsibility": "Laboratory In-charge, faculty members, and trained users.",
    "procedure": [
      "Switch ON the instrument",
      "Allow warm-up",
      "Set wavelength",
      "Measure absorbance"
    ],
    "precautions": "Avoid touching optical surfaces."
  }
}
```

To add more: Update `availableSOPs` array in `js/uiController.js`.

## 🤝 Contributing

Contributions are welcome! Help make this tool better for pharmacy education.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m 'Add YourFeature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a Pull Request.

Please follow these guidelines:
- Add tests if possible.
- Update documentation.
- Ensure code is linted (use ESLint if set up).

Report issues or suggest features via [GitHub Issues](https://github.com/himshim/pharmacy-sop-generator/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. <!-- Add LICENSE file if not present -->

## 📧 Contact

- **Developer**: Himanshu Sharma ([@himshim26](https://x.com/himshim26))
- **Email**: [your.email@example.com](mailto:himshim26@protonmail.com)
- **GitHub**: [himshim](https://github.com/himshim)

Star ⭐ the repo if you find it useful! Let's standardize pharmacy procedures together. 🚀