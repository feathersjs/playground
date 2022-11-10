{ pkgs }: {
    deps = [
        pkgs.bashInteractive
        pkgs.nodejs
        pkgs.nodePackages.vscode-langservers-extracted
        pkgs.nodePackages.typescript-language-server
    ];
}
