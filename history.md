1.3.0 @ 2021-08-24
==================

* Added a new config property: `btRequestDelay`.
* Added a new config property: `btRequestRetryCount`.
* Added an ability to override config by creating a `override-config.js` file in the root directory.
* Input from the last run is now saved to a `last-input.txt` file in the root directory.
* Logs from the last run are now saved to a `last-run.txt` file in the root directory.

1.2.0 @ 2018-05-15
==================

* Added a new config property: `btConnectTryCount`.

1.1.0 @ 2016-02-10
==================

* Fixed a crash when running the program operation.
* Fixed the test progress collection using a hard-coded value of 200ms as the progress interval instead
  of the `config.progressInterval` value.
* Changed the operation execution so that only one operation (program, test or read) can be run at once.
* Added progress reporting.
* Added more info to the readme.

1.0.0 @ 2016-02-09
==================

* Initial release.
