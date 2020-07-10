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
const serialPort = '/dev/cu.usbmodem144101',
    port = new SerialPort(serialPort, { baudRate: 9600 }),
    parser = port.pipe(new Readline({ delimiter: '\n' })), // will trigger callback on newline.
    re = new RegExp(/^mA([\-\.0-9]+)mV([\-\.0-9]+)mW([\-\.0-9]+)Cel([\-\.0-9]+)$/, "gm"),
    startTime = getDateTime(), filename = `test_output_${startTime}`;
var output = {
    test_values: []
};

fs.writeFileSync(filename, JSON.stringify(output), 'utf8');

port.on("open", () => {
    console.log(`Connected to ${serialPort}`);
});

parser.on('data', (data) => {
    console.log(`Incoming data:\n${data}`);
    const match = re.exec(data);
    if (match && match.length == 5) {
        fs.readFile(filename, 'utf8', function readFileCallback(err, data){
            if (err) {
                console.log(err);
            } else {
                dataObj = JSON.parse(data);

                dataObj.test_values.push({
                    dateTime:   getDateTime(),
                    current:    match[1],
                    voltage:    match[2],
                    power:      match[3],
                    temperature:match[4]
                }); //add the latest data

                json = JSON.stringify(dataObj);
                fs.writeFileSync(filename, json, 'utf8');
            }
        });
    }
});


