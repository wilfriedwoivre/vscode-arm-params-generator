# Change Log
All notable changes to the "vscode-arm-params-generator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.0.1] - 2018-07-12
### Added
- Initial release
- Right click on ARM file to generate new ARM parameter file
- Use command **Azure RM: Generate parameters file**
- Parameters with default value

## [0.1.0] - 2018-07-13
### Added
- Support right clik from explorer and editor title

## [0.2.0] - 2018-07-16
### Added 
- Config **arm-params-generator.ignoreDefaultParameters** to ignore default parameters from source file

## [0.3.0] - 2018-07-17
### Added 
- Command **Azure RM: Consolidate parameters file**. Add missing parameters to specific ARM parameters file 
### Changed
- Rename command **Azure RM : Generate parameters file** to  **Azure RM: Generate parameters file** (remove space)


## [0.4.0] - 2018-09-07
### Added
- Support right from explorer to create parameter from Azure RM File
### Changed
- Display name for extension

## [0.4.1] - 2018-10-22
### Added
- Support to set parameter name when extract this

## [0.4.2] - 2018-10-22
### Added
- Support multiple selectionss for parameter extractor features

## [0.5.0] - 2018-10-31
### Added
- Support extract to variables
### Changed
- Merge feature extract to parameters with extract to variables

## [0.5.1] - 2018-11-11
### Added
- Support for multilines comments in json /* comments */

## [0.6.0] - 2018-11-13
### Changed
- Update JSON schema for ARM Template

## [0.7.0] - 2019-03-21
### Updated
- Update dependency versions
- Improve error message

## [0.7.0] - 2019-10-01
### Changed
- Use new language id : `arm-template`