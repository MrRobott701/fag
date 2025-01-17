export function deleteFile(fileId) {
    return new Promise((resolve, reject) => {
      var dataSend = { 
        dataReq: { fileId }, 
        fname: "deleteFileFromGoogleDrive" 
      };
      
      fetch('https://script.google.com/macros/s/AKfycbw_7LX4rIEfhyM_6ec35m5on1sstOPnd3FBU9frZyq0QZgGfa2_xqIhUx0rOOviT2D0/exec', 
        { method: "POST", body: JSON.stringify(dataSend) })
      .then(res => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === 'success') {
          resolve(response.message);
        } else {
          reject(response.message);
        }
      })
      .catch(e => {
        console.log(e);
        reject(e);
      });
    });
  }
  