## To build

1. Download the [Arduino ide](https://www.arduino.cc/en/main/software)
2. Download the Zip files from these repositories:
*        https://github.com/adafruit/Adafruit_MCP9808_Library
*        https://github.com/adafruit/Adafruit_INA260
3. In the Arduino IDE, navigate to `Sketch > Include Library > Add .ZIP Library`, and select the ZIP files you just downloaded
4. Open the file Arduino/collect_data.ino in the Arduino IDE, and connect the device
* Make note of the 'COM' port used, it should say in `Tools > Port` which port is used
5. Verify and upload the code to the Arduino
6. Run the following commands in the base of this project
```
yarn install
yarn run collect
```
7. The data should now be being collected. If not, check that the serialPort value in index.js corresponds to the one you made note of in the Arduino IDE.
8. Ask in #software on slack for help!
