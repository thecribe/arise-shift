"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  extractClockInTime,
  setClockInTimeOne,
  setClockInTimeTwo,
  setClockOutTimeOne,
} from "../functions";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const CsvOperator = () => {
  const [shiftArray, setShiftArray] = useState([]);
  const [shiftTime, setShiftTime] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [fileName, setFileName] = useState("");
  let newShiftArray = [];

  const router = useRouter();

  const handleRoute = () => {
    window.location.reload();
  };
  //convert csv to aavigate = useNavigaterray of objects
  const handleFileSubmission = (e) => {
    const reader = new FileReader();

    // You can check multiple files by iterating over `event.target.files`
    if (e) {
      setFileName(e.name.split(".")[0]); // Access the file name
    }

    reader.onload = (e) => {
      const csvString = e.target.result;

      const csvArray = csvString.split("\n").map((line) => line.split(","));

      // csvArray && setShiftArray(csvArray);
      let arrayShift = [];
      csvArray.forEach((element, index) => {
        if (index > 0 && element[0].length > 0) {
          arrayShift.push({
            date: element[0],
            name: element[1],
            shift: element[2].replace(/\r/g, ""),
            staff: element[3].replace(/\r/g, ""),
            // date_time: extractClockInTime(element[0], element[2]),
          });
        }
      });

      arrayShift.forEach((arr, index) => {
        arrayShift[index].date_time = extractClockInTime(arr.date, arr.shift);
      });

      arrayShift.sort((a, b) => {
        if (a.date_time > b.date_time) {
          return 1;
        }

        if (a.date_time < b.date_time) {
          return -1;
        }

        return 0;
      });

      setShiftArray(arrayShift);
    };

    reader.readAsText(e);
  };

  console.log(fileName);
  //display all shifts time
  const displayShiftTime = () => {
    let arrayHandler = [];
    shiftArray.forEach((element) => {
      if (arrayHandler.length > 0) {
        if (!arrayHandler.includes(element.shift) && !!element.shift) {
          arrayHandler = [...arrayHandler, element.shift];
        }
      } else {
        arrayHandler = [...arrayHandler, element.shift];
      }
    });

    let newShiftArray = [];
    arrayHandler.forEach((arr) => {
      newShiftArray.push({ shift: arr, duration: 0, variation: 5 });
    });
    setShiftTime(newShiftArray);
  };

  const shiftUpdateHandler = (input, index, type) => {
    let newshiftTime = [...shiftTime];
    if (type === "duration") {
      newshiftTime[index].duration = +input;
    } else {
      newshiftTime[index].variation = +input;
    }

    setShiftTime([...newshiftTime]);
  };
  useEffect(() => {
    if (shiftArray.length > 0) {
      displayShiftTime();
      setToggle(true);
    }
  }, [shiftArray]);

  let shiftDate = new Date();
  let clockInTime = null;
  let clockInMetre = null;

  let clockOutTime = null;

  if (shiftArray.length > 0) {
    shiftArray.forEach((arr) => {
      if (arr.shift) {
        const dateAndTime = extractClockInTime(arr.date, arr.shift);

        if (new Date(shiftDate).getTime() !== new Date(dateAndTime).getTime()) {
          shiftDate = dateAndTime;

          //Access variation by looping through shiftTime
          // Use findIndex to locate the object containing the search string
          const index = shiftTime.findIndex(
            (obj) => obj.shift.toLowerCase() === arr.shift.toLowerCase()
          );

          //Set clockin time
          if (index >= 0) {
            const responseClockIn = setClockInTimeOne(
              dateAndTime,
              shiftTime[index].variation
            );

            const responseClockOut = setClockOutTimeOne(
              responseClockIn,
              shiftTime[index].duration,
              shiftTime[index].variation
            );
            clockInMetre = Math.floor(Math.random() * 73) + 8;
            clockInTime = responseClockIn;
            clockOutTime = responseClockOut;

            newShiftArray.push({
              ...arr,
              clockInTime: responseClockIn,
              clockOutTime: responseClockOut,
              clockInMetre,
              clockOutMetre: Math.floor(Math.random() * clockInMetre) + 1,
            });
          }
        } else {
          //Set clockin time
          if (clockInTime) {
            const responseClockIn = setClockInTimeTwo(clockInTime, 1);

            const responseClockOut = setClockInTimeTwo(clockOutTime, 1);

            newShiftArray.push({
              ...arr,
              clockInTime: responseClockIn,
              clockOutTime: responseClockOut,
              clockInMetre:
                clockInMetre + Math.floor(Math.random() * (5 * 2 + 1) - 5),
              clockOutMetre: Math.floor(Math.random() * clockInMetre) + 1,
            });
          }
        }
      }
    });
  }

  const downloadHandler = () => {
    let csvConvertString;
    let csvConvertArray = [
      [
        "Date",
        "Name",
        "Shift",
        "Staff",
        "Clock-in",
        "Clock-in Metre",
        "Clock-Out",
        "Clock-out Metre",
      ],
    ];
    if (newShiftArray.length > 0) {
      newShiftArray.forEach((arr) => {
        csvConvertArray.push([
          arr.date,
          arr.name,
          arr.shift.replace(/\r/g, ""),
          arr.staff.replace(/\r/g, ""),
          arr.clockInTime,
          arr.clockInMetre + " m",
          arr.clockOutTime,
          arr.clockOutMetre + " m",
        ]);
      });
    }

    csvConvertString = csvConvertArray.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvConvertString], { type: "text/csv" });

    // 3. Create a URL for the Blob and make it downloadable
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`; // The downloaded filename
    document.body.appendChild(link);

    // 4. Programmatically click the link to trigger the download, then remove it
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL
  };

  return (
    <Fragment>
      <section className=" w-4/6 h-full my-0 mx-auto flex justify-center items-center p-5">
        {!toggle ? (
          <div className="w-full flex flex-col justify-center items-center shadow-sm py-32 rounded-md">
            <div className="w-1/3 flex flex-col gap-5 justify-center items-center border border-dotted py-16  border-blue-900 rounded-sm">
              <label>Upload a .csv file</label>
              <div className="relative  w-full flex justify-center items-center cursor-pointer">
                <input
                  className="absolute left-[40%] opacity-0 cursor-pointer z-20"
                  name="csv-file"
                  id="csv-file"
                  accept=".csv, .CSV"
                  type="file"
                  multiple={false}
                  onChange={(e) => handleFileSubmission(e.target.files[0])}
                />

                <FaCloudUploadAlt className="text-6xl text-blue-900" />
              </div>
            </div>
          </div>
        ) : (
          <div className=" w-full  flex flex-col gap-5 justify-center items-center ">
            <div className="w-full bg-white rounded-sm shadow-sm overflow-auto p-5">
              <h2 className="font-bold text-blue-900 border-b-2 py-2">
                Shift Time and Duration
              </h2>
              <div className=" flex py-5 max-w-full gap-2 divide-x-2 overflow-x-auto">
                {shiftTime.length > 0
                  ? shiftTime.map((eachShift, index) => {
                      return (
                        <div
                          key={index}
                          className=" p-3 w-[15rem] flex flex-col gap-3 text-xs "
                        >
                          <h3 className="w-full text-blue-900 font-bold ">
                            Shift: {eachShift.shift}
                          </h3>
                          <div className="flex gap-3 items-center w-full">
                            <label className="text-blue-900 font-bold">
                              Duration:
                            </label>
                            <input
                              type="number"
                              onChange={(e) =>
                                shiftUpdateHandler(
                                  e.target.value,
                                  index,
                                  "duration"
                                )
                              }
                              placeholder="0"
                              className=" outline-blue-900 outline p-1 outline-1"
                            />
                          </div>
                          <div className="flex gap-3  items-center ">
                            <label className="text-blue-900 font-bold">
                              Variation:
                            </label>
                            <input
                              type="number"
                              placeholder={eachShift.variation}
                              onChange={(e) =>
                                shiftUpdateHandler(
                                  e.target.value,
                                  index,
                                  "variation"
                                )
                              }
                              className="  outline-blue-900 outline p-1 outline-1"
                            />
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
            <div className=" w-full flex justify-between items-center p-5  bg-white rounded-sm shadow-sm">
              <h2 className="font-bold text-blue-900">
                Generated Shift Preview
              </h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleRoute}
                  className="hover:bg-blue-900 outline outline-1 outline-blue-900 text-blue-900 hover:text-white p-2 rounded-sm hover:shadow-md smooth_transition  text-sm hover:scale-105"
                >
                  Upload new CSV
                </button>
                <button
                  onClick={downloadHandler}
                  className="bg-blue-900 text-white p-2 rounded-sm hover:shadow-md smooth_transition  text-sm hover:scale-105"
                >
                  Download CSV
                </button>
              </div>
            </div>
            <div className="w-full h-[500px] overflow-y-auto  bg-white rounded-sm shadow-sm">
              <table className="w-full shadow-sm text-left py-5">
                <thead className="bg-blue-900 sticky top-0 text-sm text-white ">
                  <tr>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Name</th>
                    <th className="py-3 px-5">Shift</th>
                    <th className="py-3 px-5">Staff</th>
                    <th className="py-3 px-5">Clock-In</th>
                    <th className="py-3 px-5">Clock-In Metre</th>
                    <th className="py-3 px-5">Clock-Out</th>
                    <th className="py-3 px-5">Clock-Out Metre</th>
                  </tr>
                </thead>
                <tbody className="text-xs ">
                  {newShiftArray.length > 0
                    ? newShiftArray.map((shift, index) => {
                        return (
                          <tr key={index}>
                            <td className="py-3 px-5 items-center">
                              {shift.date}
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.name}
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.shift}
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.staff}
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.clockInTime}
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.clockInMetre} m
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.clockOutTime}
                            </td>
                            <td className="py-3 px-5  items-center">
                              {shift.clockOutMetre} m
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
};

export default CsvOperator;
