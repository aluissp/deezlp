#!/usr/bin/env bash

# Stop execution if any command fails
set -e

# Setup
REPO_USER="aluissp"
REPO_NAME="deezlp"
VERSION="cli-v1.0.0"
BINARY_NAME="deezlp"
URL="https://github.com/${REPO_USER}/${REPO_NAME}/releases/download/${VERSION}/${BINARY_NAME}"

# Installation path (~/.local/bin)
TARGET_DIR="${HOME}/.local/bin"
TARGET_PATH="${TARGET_DIR}/${BINARY_NAME}"

echo "Starting installation of ${BINARY_NAME}..."

# 1. Validate if the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    mkdir -p "$TARGET_DIR"
fi

# 2. Validate: Verify that curl is installed on the system
if ! command -v curl &> /dev/null; then
    echo "Curl is not installed, please install it before continuing."
    exit 1
fi

# 3. Download the binary from GitHub
echo "Downloading binary from GitHub..."
if ! curl -L --fail -o "$TARGET_PATH" "$URL"; then
    echo "Failed to download the binary from GitHub. Please check your internet connection or the URL."
    exit 1
fi

# 4. Assign execution permissions to the binary
echo "Assigning execution permissions..."
chmod +x "$TARGET_PATH"

# 5. Validate if PATH contains the target directory
if [[ ":$PATH:" != *":$TARGET_DIR:"* ]]; then
    echo "Warning: '${TARGET_DIR}' if not available in your PATH."
    echo "Setting it up permanently in your profile..."

    # Detect the shell and add the export command
    if [ -n "$ZSH_VERSION" ] && [ -f "${HOME}/.zshrc" ]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.zshrc"
        echo "Added to ~/.zshrc, reboot your shell or run: source ~/.zshrc"
    fi

    if [ -f "${HOME}/.bashrc" ]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.bashrc"
        echo "Added to ~/.bashrc, reboot your shell or run: source ~/.bashrc"
    fi

    if [ -f "${HOME}/.xprofile" ]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.xprofile"
        echo "Added to ~/.xprofile, reboot your session or run: source ~/.xprofile"
    else
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.profile"
        echo "Added to ~/.profile, reboot your session or run: source ~/.profile"
    fi
fi

echo "✨ Installation completed successfully: ${BINARY_NAME}"
