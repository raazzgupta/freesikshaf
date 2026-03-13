const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


const generateCertificate = async (
 userName,
 courseName,
 issueDate,
 certificateId,
 instructorName = "Instructor"
) => {

 return new Promise((resolve, reject) => {

  try {

   const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 50
   });

   // ensure certificates folder exists
   const certDir = path.join(__dirname, "../public/certificates");

   if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
   }

   const fileName = `certificate_${certificateId}.pdf`;
   const filePath = path.join(certDir, fileName);
   const relativeUrl = `/certificates/${fileName}`;

   const stream = fs.createWriteStream(filePath);
   doc.pipe(stream);

   const pageWidth = doc.page.width;

   // border
   doc
    .rect(20, 20, pageWidth - 40, doc.page.height - 40)
    .stroke();

   doc.moveDown(2);

   // title
   doc
    .fontSize(42)
    .fillColor("#2c3e50")
    .text("Certificate of Completion", {
     align: "center"
    });

   doc.moveDown(2);

   doc
    .fontSize(20)
    .text("This is to certify that", {
     align: "center"
    });

   doc.moveDown();

   // student name
   doc
    .fontSize(32)
    .fillColor("#000")
    .text(userName, {
     align: "center",
     underline: true
    });

   doc.moveDown();

   doc
    .fontSize(20)
    .text("has successfully completed the course", {
     align: "center"
    });

   doc.moveDown();

   // course name
   doc
    .fontSize(26)
    .text(courseName, {
     align: "center"
    });

   doc.moveDown(3);

   // instructor
   doc
    .fontSize(16)
    .text(`Instructor: ${instructorName}`, {
     align: "center"
    });

   doc.moveDown(2);

   // footer
   doc
    .fontSize(14)
    .text(`Date of Issue: ${issueDate.toDateString()}`, 60, doc.page.height - 80);

   doc
    .fontSize(14)
    .text(`Certificate ID: ${certificateId}`, pageWidth - 300, doc.page.height - 80);

   doc.end();

   stream.on("finish", () => {
    resolve(relativeUrl);
   });

   stream.on("error", err => {
    reject(err);
   });

  } catch (error) {

   reject(error);

  }

 });

};


module.exports = {
 generateCertificate
};
