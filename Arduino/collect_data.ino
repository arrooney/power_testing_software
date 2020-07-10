/*
*    Must import libraries from the following repositories:
*        https://github.com/adafruit/Adafruit_MCP9808_Library
*        https://github.com/adafruit/Adafruit_INA260
*/

#include <Wire.h>
#include "Adafruit_INA260.h"
#include "Adafruit_MCP9808.h"

// Create the MCP9808 temperature sensor object
Adafruit_MCP9808 tempsensor = Adafruit_MCP9808();
Adafruit_INA260 ina260      = Adafruit_INA260();

void setup() {
  Serial.begin(9600);
  // Wait until serial port is opened
  while (!Serial) { delay(10); }

  if (!ina260.begin() || !tempsensor.begin(0x18)) {
    Serial.println("ERROR");
    while (1);
  }

  // init worked :) set up devices...
  ina260.setMode(INA260_MODE_CONTINUOUS);
  tempsensor.setResolution(3); // mode: 3, resolution: 0.0625°C, sample Period: 250 ms
  tempsensor.wake(); // wake up, ready to read!
}

void loop() {
  float current, voltage, power, temp;

  current = ina260.readCurrent();     // mA
  voltage = ina260.readBusVoltage();  // mV
  power   = ina260.readPower();       // mW
  temp    = tempsensor.readTempC();   // degC
  
  // Report to the host computer...
  Serial.print("mA"); Serial.print(current, 4);
  Serial.print("mV"); Serial.print(voltage, 4);
  Serial.print("mW"); Serial.print(power, 4);
  Serial.print("Cel"); Serial.println(temp, 4);
  delay(5000);
}
