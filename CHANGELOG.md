# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.0.2] - 2021-05-13

### Changed

- Adjust options `--errorOnFail` and `--errorOnScreenshotFail` to be `boolean` type to allow for implicit `true` when provided.

## [6.0.1] - 2021-05-10

### Added

- Added explicit options for `--errorOnFail` and `--errorOnScreenshotFail` to `ghost-inspector test execute-on-demand` command.

## [6.0.0] - 2021-05-10

### Added

- Added [ngrok](https://ngrok.com/) support to execution commands with `--ngrokTunnel` option.

### Changed

- Response signature for `GhostInspector.executeTestOnDemand()` has been changed to `[{result}, passing, screenshotComparePassing]` for consistency.

### Removed

- Removed Node.js 8 support.

## [5.0.4] - 2021-04-29

### Added

- Added ability to provide `--jsonInput`.

## [5.0.3] - 2021-04-27

### Changed

- Force all built-in parameters to use `--camelCase` to allow for user variables using `--kebab-case`.

## [5.0.2] - 2021-04-20

### Changed

- Corrected docs regarding `--errorOnFail` and `--errorOnScreenshotFail`.

## [5.0.1] - 2021-04-14

### Added

- Added support for the `ghost-inspector` Command Line Interface.
