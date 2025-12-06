# CollabTask Desktop App

A modern task management and collaboration desktop application built with Electron, React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Desktop Native**: Runs as a native desktop application on Windows, macOS, and Linux
- **Modern UI**: Beautiful, responsive interface with dark/light mode support
- **Task Management**: Create, organize, and track tasks with multiple views (Board, List)
- **Real-time Collaboration**: Chat and collaborate with team members
- **Time Tracking**: Built-in time tracking for productivity monitoring
- **Reports & Analytics**: Comprehensive reporting and data visualization
- **Workflows**: Automated workflow management
- **Offline Support**: Works offline with local data storage

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vineetsahoo/CollabTask.git
cd CollabTask/project
```

2. Install dependencies:
```bash
npm install
```

### Running the App

#### Development Mode (Hot Reload)
```bash
npm run electron:dev
```
This starts both the Vite dev server and Electron, with hot reload for development.

#### Production Mode
```bash
npm run build
npm run electron
```

### Building Distributables

#### Build for all platforms:
```bash
npm run dist
```

#### Build for specific platforms:
```bash
npm run dist:win    # Windows
npm run dist:mac    # macOS  
npm run dist:linux  # Linux
```

The built applications will be in the `dist-electron` folder.

## 📦 Project Structure

```
project/
├── electron/              # Electron main process files
│   ├── main.js            # Main Electron process
│   ├── preload.js         # Preload script for security
│   └── assets/            # App icons and assets
├── src/                   # React application source
│   ├── components/        # Reusable React components
│   ├── pages/             # Application pages/views
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── data/              # Mock data and constants
├── dist/                  # Built React application
└── dist-electron/         # Built desktop applications
```

## 🎯 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build React app for production
- `npm run electron` - Run Electron with built React app
- `npm run electron:dev` - Run in development mode with hot reload
- `npm run electron:pack` - Package app (no installer)
- `npm run electron:dist` - Build distributable packages
- `npm run dist` - Build for all platforms
- `npm run dist:win` - Build Windows installer
- `npm run dist:mac` - Build macOS DMG
- `npm run dist:linux` - Build Linux AppImage

## 🔧 Configuration

### App Configuration
The app configuration is in `package.json` under the `build` section:

- **App ID**: `com.vineetsahoo.collabtask`
- **Product Name**: CollabTask
- **Output Directory**: `dist-electron`

### Icons
Place your app icons in `electron/assets/`:
- `icon.png` - 512x512 PNG for Linux
- `icon.ico` - ICO file for Windows
- `icon.icns` - ICNS file for macOS

## 🖥️ Desktop Features

### Menu Bar Integration
- **File Menu**: New Task (Ctrl/Cmd+N), Settings (Ctrl/Cmd+,)
- **View Menu**: Navigate between different app sections
- **Native Shortcuts**: Standard copy/paste, zoom, etc.

### System Integration
- **Notifications**: Native desktop notifications
- **Taskbar/Dock**: Proper app integration
- **Auto-updater**: Ready for app updates (when configured)

## 🔒 Security

The app follows Electron security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- Secure preload script for API exposure
- Content Security Policy

## 🚀 Deployment

### Automatic Updates
To enable automatic updates, configure your update server in `electron/main.js` and set up:
- Code signing certificates
- Update server (electron-updater)
- Release automation

### Distribution
1. **Windows**: Creates NSIS installer (.exe)
2. **macOS**: Creates DMG file (.dmg)
3. **Linux**: Creates AppImage (.AppImage)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📱 Future Enhancements

- Mobile companion app
- Cloud synchronization
- Plugin system
- Advanced integrations (Slack, Teams, etc.)
- Enhanced offline capabilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- UI powered by [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations by [Framer Motion](https://framer.com/motion/)

---

**Note**: This desktop app version gives you the full power of your web application as a native desktop experience with system integration, offline capabilities, and improved performance.
