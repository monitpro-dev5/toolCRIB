import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import MCFLogo from "../../Images/MCFLogo.jpg";

function MyDocument() {
  const { id } = useParams();

  const pdfName = "document";

  // Create styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      width: "100%",
      height: "100%",
      paddingTop: 30,
      paddingBottom: 30,
      paddingHorizontal: 30,
    },
    logo: {
      margin: "auto",
      marginTop: 2,
      fontSize: 12,
      padding: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    aligncenter: {
      textAlign: "center",
    },
    font12: {
      fontSize: 12,
    },
    font10: {
      fontSize: 10,
    },
    //#region Table styles
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
    },
    tablewithoutborder: {
      display: "table",
      width: "100%",
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableCell: {
      fontSize: 12,
      padding: 3,
    },

    //#region Border
    border: {
      borderStyle: "solid",
      borderWidth: 1,
    },
    leftBorder: {
      borderLeftWidth: 1,
      borderLeftStyle: "solid",
    },
    rightBorder: {
      borderRightWidth: 1,
      borderRightStyle: "solid",
    },
    topBorder: {
      borderTopWidth: 1,
      borderTopStyle: "solid",
    },
    bottomBorder: {
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
    },
    //#endregion

    //#region Cell Percentage
    cell5: {
      width: "5%",
    },
    cell10: {
      width: "10%",
    },
    cell15: {
      width: "15%",
    },
    cell20: {
      width: "20%",
    },
    cell30: {
      width: "30%",
    },
    cell40: {
      width: "40%",
    },
    cell50: {
      width: "50%",
    },
    cell60: {
      width: "60%",
    },
    cell70: {
      width: "70%",
    },
    cell100: {
      width: "100%",
    },
    //#endregion

    //#endregion
  });

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <PDFViewer width="100%" height="100%" fileName={pdfName}>
        <Document>
          <Page size="A4" style={styles.page} wrap orientation="landscape">
            <div>
              {/* Heading */}
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={[styles.logo, styles.cell20]}>
                    <Image style={{ width: 50, height: 30 }} src={MCFLogo} />
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.aligncenter,
                      styles.cell50,
                    ]}
                  >
                    <Text>MANGALORE CHEMICALS & FERTILIZERS LTD.,</Text>
                    <Text>MANGALORE-10</Text>
                    <Text>Returnable Material Gate Pass (RMGP)</Text>
                  </View>

                  <View
                    style={[
                      styles.font12,
                      styles.tablewithoutborder,
                      styles.cell30,
                    ]}
                  >
                    <View style={[styles.tableRow]}>
                      <View
                        style={[
                          styles.tableCell,
                          styles.aligncenter,
                          styles.cell50,
                          styles.leftBorder,
                          { height: 48 },
                        ]}
                      >
                        <Text style={[styles.font10, { marginTop: "8" }]}>
                          1. Department: IT{" "}
                        </Text>
                        <Text style={[styles.font10, { marginTop: "5" }]}>
                          2. Date: 27/11/2023
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell,
                          styles.aligncenter,
                          styles.cell50,
                          styles.leftBorder,
                          { height: 48 },
                        ]}
                      >
                        <Text style={{ marginTop: "15" }}> S.No : {id}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* 2nd Row */}
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell70,
                      styles.aligncenter,
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>
                      For Use Of Originating Dept
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.aligncenter,
                      styles.leftBorder,
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>
                      For Use Of Security Dept
                    </Text>
                  </View>
                </View>
              </View>

              {/* 3rd Row */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell5,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 41 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: "12" }}>
                      3. S.No
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell40,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 41 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>
                      4. Full Description Of Material
                    </Text>
                    <Text style={{ fontSize: "10px" }}>
                      (With SI.No, Capacity Model, Size etc,.)
                    </Text>
                    <Text style={{ fontSize: "10px" }}>
                      (Only one item per Gate Pass)
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell5,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 41 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: "10" }}>
                      5. Qnty
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 41 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: "3" }}>
                      6. Expected
                    </Text>
                    <Text style={{ fontSize: "10px", marginTop: "3" }}>
                      Date Of Return
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 41 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: "3" }}>
                      7. Value
                    </Text>
                    <Text style={{ fontSize: "10px", marginTop: "3" }}>
                      (Apprx.Rs)
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder,
                      { height: 41 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: "3" }}>
                      17. Sec. Count. No.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Material Bynamic Data 4th Row */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell5,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 40 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>1</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell40,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 40 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>
                      Full Description of the Bur CutterFull Description of the
                      Bur CutterFull Description of the Bur CutterFull
                      Description of the Bur Cutter
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell5,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 40 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>1</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 40 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>30/11/2023</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 40 },
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>40000</Text>
                  </View>
                  <View
                    style={[
                      styles.tablewithoutborder,
                      styles.cell30,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder,
                      { height: 40 },
                    ]}
                  >
                    <View
                      style={[
                        styles.tableRow,
                        styles.aligncenter,
                        styles.bottomBorder,
                        { width: 232, height: 20 },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: "10px",
                          marginTop: 1,
                          marginLeft: 87,
                        }}
                      >
                        Date & Time
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableRow,
                        styles.aligncenter,
                        styles.bottomBorder,
                        { width: 232, height: 20 },
                      ]}
                    >
                      <View
                        style={[
                          styles.tableCell,
                          styles.cell50,
                          styles.aligncenter,
                        ]}
                      >
                        <Text style={{ fontSize: "10px" }}>18. OUT</Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell,
                          styles.cell50,
                          styles.aligncenter,
                          styles.leftBorder,
                        ]}
                      >
                        <Text style={{ fontSize: "10px" }}>19. IN</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* 5th Row Proposed by authorised by data */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.leftBorder,
                      styles.bottomBorder,
                      styles.rightBorder,
                      {height:40}
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>8. Purpose:</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>11. Proposed By</Text>
                    <Text style={{ fontSize: "10px", marginTop: 8, marginLeft: 16}}>Name:</Text>
                    
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.leftBorder,
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>12. Authorised By</Text>
                    <Text style={{ fontSize: "10px", marginTop: 8, marginLeft: 16}}>Name:</Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: 6 }}>Entered in Cont. Reg. & Pink Copy Filed</Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: 6 }}>Received in Sec. Cont. Reg. & Yellow Copy File</Text>
                  </View>
                </View>
              </View>

              {/* 6th Row */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.leftBorder,
                      styles.bottomBorder,
                      styles.rightBorder,
                      {height:40}
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>9. Address where materials are to be sent:</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginLeft: 16 }}>Sign: __________________</Text>
                    <Text style={{ fontSize: "10px", marginTop: 10, marginLeft: 16 }}>Desn: </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.leftBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginLeft: 16 }}>Sign: __________________</Text>
                    <Text style={{ fontSize: "10px", marginTop: 10, marginLeft: 16 }}>Desn: </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.aligncenter,
                      styles.leftBorder,
                    ]}
                  >
                    <View
                    style={[
                      styles.tableCell,
                      styles.aligncenter,
                      styles.border,
                      {height: 30, width: 110}
                    ]}
                  ></View>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.rightBorder,
                    ]}
                  >
                    <View
                    style={[
                      styles.tableCell,
                      styles.aligncenter,
                      styles.border,
                      {height: 30, width: 109}
                    ]}
                  ></View>
                  </View>
                </View>
              </View>

              {/* 7th Row */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.leftBorder,
                      styles.bottomBorder,
                      styles.rightBorder,
                      {height:40}
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>10. Mode Of Transport:</Text>
                    <Text style={{ fontSize: "10px", marginLeft: 16, marginTop: 3 }}>Regn No:</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.bottomBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: 5, marginLeft: 16 }}>T.No: </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.leftBorder,
                      styles.bottomBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px", marginTop: 5, marginLeft: 16 }}>T.No: </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.leftBorder,
                      styles.bottomBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>Sign: ____________ </Text>
                    <Text style={{ fontSize: "10px" }}>Name: ____________</Text>
                    <Text style={{ fontSize: "10px" }}>Design: ____________</Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder
                    ]}
                  >
                    <Text style={{ fontSize: "10px" }}>Sign: ____________</Text>
                    <Text style={{ fontSize: "10px" }}>Name: ____________</Text>
                    <Text style={{ fontSize: "10px" }}>Design: ____________</Text>
                  </View>
                </View>
              </View>

            </div>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}

export default MyDocument;
