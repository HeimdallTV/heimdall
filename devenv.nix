{ pkgs, ... }:

{
  name = "heimdall";

  dotenv.enable = true;

  packages = with pkgs; [ git ];

  languages = {
    javascript = {
      enable = true;

      package = pkgs.nodejs_21;
      corepack.enable = true;
    };

    typescript.enable = true;
  };

  # https://devenv.sh/scripts/
  scripts = {
    build.exec = "npm run build";
    extension-build.exec = "cd extension && npm run build:debug";
  };

  # https://devenv.sh/processes/
  processes = { dev.exec = "npm run dev"; };
}
