# deezlp cli

This is a command-line interface (CLI) tool for deezlp, a project that allows you to download music from Deezer. The CLI is built using [Bun](https://bun.sh), a fast JavaScript runtime.

## Installation

Run the following command to install the CLI tool:

```bash
# linux
curl -sSL https://raw.githubusercontent.com/aluissp/deezlp/refs/heads/dev/packages/cli/install.sh | bash

# windows
irm https://raw.githubusercontent.com/aluissp/deezlp/refs/heads/dev/packages/cli/install.ps1 | iex
```

## From the source

If you want to compile the CLI from the source, you can clone the repository and run the following commands:

```bash
git clone https://github.com/aluissp/deezlp.git
cd deezlp/packages/cli
bun install
bun run compile
```
