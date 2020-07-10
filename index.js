/**
 * @file index.js
 * @author Andrew Rooney
 * @date 2020-07-09
 */
const SerialPort = require('serialport'),
    Readline = require('@serialport/parser-readline'),
    fs = require('fs'),
    getDateTime = () => {
        const now = new Date(),
            date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate(),
            time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
            dateTime = `${date}_${time}`;
        return dateTime;
    };

const serialPort = '/dev/cu.usbmodem146101', // << change ME
    port = new SerialPort(serialPort, { baudRate: 9600 }),
    parser = port.pipe(new Readline({ delimiter: '\n' })), // will trigger callback on newline.
    re = new RegExp(/^mA([\-\.0-9]+)mV([\-\.0-9]+)mW([\-\.0-9]+)Cel([\-\.0-9]+)$/, "gm"),
    startTime = getDateTime(), filename = `test_output_${startTime}.json`;

var output = {
    test_values: {
        dateTime:       [],
        current_ma:     [],
        voltage_mv:     [],
        power_mw:       [],
        temperature_cel:[]
    }
};

fs.writeFileSync(filename, JSON.stringify(output), 'utf8');

port.on('open', () => {
    console.log(`Connected to ${serialPort}`);
});

port.on('error', (err) => {
    console.log(`Error: check connection to Arduino, or serialPort name. ${err}`);
})

parser.on('data', (data) => {
    console.log(`Incoming data:\n${data}`);
    const match = re.exec(data);
    if (match && match.length == 5) {
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                console.log(err);
                throw err;
            }
            dataObj = JSON.parse(data);
            dataObj.test_values.dateTime.push(getDateTime());
            dataObj.test_values.current_ma.push(match[1]);
            dataObj.test_values.voltage_mv.push(match[2]);
            dataObj.test_values.power_mw.push(match[3]);
            dataObj.test_values.temperature_cel.push(match[4]);
            json = JSON.stringify(dataObj);

            try {
                fs.writeFileSync(filename, json, 'utf8');
            } catch (e) {
                console.log(`Error writing to JSON. ${e}`);
                throw e;
            }
        });
    }
});
