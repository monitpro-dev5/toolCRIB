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

    //#region Font Size
    font10: {
      fontSize: 10,
    },
    font12: {
      fontSize: 12,
    },
    font14: {
      fontSize: 14,
    },
    //#endregion

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
      flexDirection: "row",
    },
    tableCell: {
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
    cell6: {
      width: "6%",
    },
    cell10: {
      width: "10%",
    },
    cell15: {
      width: "15%",
    },
    cell17_5: {
      width: "17.5%",
    },
    cell20: {
      width: "20%",
    },
    cell30: {
      width: "30%",
    },
    cell38: {
      width: "38%",
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
      <PDFViewer width="100%" height="100%">
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
                      { height: 70 },
                    ]}
                  >
                    <Text style={[styles.font14, { marginTop: 8 }]}>
                      MANGALORE CHEMICALS & FERTILIZERS LTD.,
                    </Text>
                    <Text style={[styles.font10, { marginTop: 5 }]}>
                      MANGALORE-10
                    </Text>
                    <Text style={[styles.font12, { marginTop: 5 }]}>
                      Returnable Material Gate Pass (RMGP)
                    </Text>
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
                          { height: 70 },
                        ]}
                      >
                        <Text style={[styles.font12, { marginTop: "5" }]}>
                          1. Department:
                        </Text>
                        <Text style={[styles.font12, { marginTop: "5" }]}>
                          IT
                        </Text>
                        <Text style={[styles.font12, { marginTop: "8" }]}>
                          2. Date: 27/11/2023
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell,
                          styles.aligncenter,
                          styles.cell50,
                          styles.leftBorder,
                          { height: 70 },
                        ]}
                      >
                        <Text style={{ marginTop: 25 }}> S.No : {id}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* 2nd Row */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell70,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                    ]}
                  >
                    <Text style={[styles.font10]}>
                      For Use Of Originating Dept
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder,
                    ]}
                  >
                    <Text style={[styles.font10]}>
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
                      styles.cell6,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12, { marginTop: "15" }]}>
                      3. S.No
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell38,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12, { marginTop: 5 }]}>
                      4. Full Description Of Material
                    </Text>
                    <Text style={[styles.font10]}>
                      (With SI.No, Capacity Model, Size etc,.)
                    </Text>
                    <Text style={[styles.font10]}>
                      (Only one item per Gate Pass)
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell6,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12, { marginTop: "15" }]}>
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
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12, { marginTop: "3" }]}>
                      6. Expected
                    </Text>
                    <Text
                      style={[
                        styles.font12,
                        { marginTop: "3", marginLeft: 13 },
                      ]}
                    >
                      Date Of
                    </Text>
                    <Text
                      style={[
                        styles.font12,
                        { marginTop: "3", marginLeft: 12 },
                      ]}
                    >
                      Return
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12, { marginTop: "7" }]}>
                      7. Value
                    </Text>
                    <Text style={[styles.font12, { marginTop: "3" }]}>
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
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12, { marginTop: "1" }]}>
                      17. Sec. Count. No.
                    </Text>
                  </View>
                </View>
              </View>

              {/* 4th Row Material Bynamic Data */}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell6,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 80 },
                    ]}
                  >
                    <Text style={[styles.font10]}>1</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell38,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 80 },
                    ]}
                  >
                    <Text style={[styles.font10]}>
                      Full Description of the Bur CutterFull Description of the
                      Bur CutterFull Description of the Bur CutterFull
                      Description of the Bur CutterFull Description of the Bur
                      CutterFull Description of the Bur CutterFull Description
                      of the Bur CutterFull Description of the Bur Cutter
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell6,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 80 },
                    ]}
                  >
                    <Text style={[styles.font10]}>1</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 80 },
                    ]}
                  >
                    <Text style={[styles.font10]}>30/11/2023</Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell10,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 80 },
                    ]}
                  >
                    <Text style={[styles.font10]}>80000</Text>
                  </View>
                  <View
                    style={[
                      styles.tablewithoutborder,
                      styles.cell30,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder,
                      { height: 80 },
                    ]}
                  >
                    <View
                      style={[
                        styles.tableRow,
                        styles.bottomBorder,
                        { width: 232, height: 20 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.font12,
                          { marginLeft: 85, marginTop: 3 },
                        ]}
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
                        <Text style={[styles.font10]}>18. OUT</Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell,
                          styles.cell50,
                          styles.aligncenter,
                          styles.leftBorder,
                        ]}
                      >
                        <Text style={[styles.font10]}>19. IN</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.tableRow,
                        styles.aligncenter,
                        { width: 232, height: 40 },
                      ]}
                    >
                      <View
                        style={[
                          styles.tableCell,
                          styles.cell50,
                          styles.aligncenter,
                        ]}
                      >
                        <Text style={[styles.font10, { marginTop: 11 }]}>
                          27/11/2023
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCell,
                          styles.cell50,
                          styles.aligncenter,
                          styles.leftBorder,
                        ]}
                      >
                        <Text style={[styles.font10, { marginTop: 11 }]}>
                          30/11/2023
                        </Text>
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
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12]}>8. Purpose:</Text>
                  </View>
                  <View style={[styles.tableCell, styles.cell20]}>
                    <Text style={[styles.font12]}>11. Proposed By</Text>
                    <Text
                      style={[styles.font10,{ marginTop: 12, marginLeft: 16 }]}
                    >
                      Name:
                    </Text>
                  </View>
                  <View
                    style={[styles.tableCell, styles.cell20, styles.leftBorder]}
                  >
                    <Text style={[styles.font12]}>12. Authorised By</Text>
                    <Text
                      style={[styles.font10,{ marginTop: 12, marginLeft: 16 }]}
                    >
                      Name:
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.aligncenter,
                      styles.leftBorder,
                    ]}
                  >
                    <Text style={[styles.font10,{ marginTop: 10 }]}>
                      Entered in Cont. Reg. & Pink Copy Filed
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.aligncenter,
                      styles.leftBorder,
                      styles.rightBorder,
                    ]}
                  >
                    <Text style={[styles.font10,{ marginTop: 10 }]}>
                      Received in Sec. Cont. Reg. & Yellow Copy File
                    </Text>
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
                      { height: 50 },
                    ]}
                  >
                    <Text style={[styles.font12]}>
                      9. Address where materials are to be sent:
                    </Text>
                  </View>
                  <View style={[styles.tableCell, styles.cell20]}>
                    <Text style={[styles.font10,{ marginLeft: 16 }]}>
                      Sign: __________________
                    </Text>
                    <Text
                      style={[styles.font10,{
                        marginTop: 14,
                        marginLeft: 16,
                      }]}
                    >
                      Desn:
                    </Text>
                  </View>
                  <View
                    style={[styles.tableCell, styles.cell20, styles.leftBorder]}
                  >
                    <Text style={[styles.font10,{ marginLeft: 16 }]}>
                      Sign: __________________
                    </Text>
                    <Text
                      style={[styles.font10,{
                        marginTop: 14,
                        marginLeft: 16,
                      }]}
                    >
                      Desn:
                    </Text>
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
                        { height: 30, width: 109 },
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
                        { height: 30, width: 109 },
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
                      { height: 60 },
                    ]}
                  >
                    <Text style={[styles.font12]}>
                      10. Mode Of Transport:
                    </Text>
                    <Text
                      style={[styles.font12,{ marginLeft: 19, marginTop: 8 }]}
                    >
                      Regn No:
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.bottomBorder,
                    ]}
                  >
                    <Text
                      style={[styles.font10,{ marginTop: 5, marginLeft: 16 }]}
                    >
                      T.No:
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.leftBorder,
                      styles.bottomBorder,
                    ]}
                  >
                    <Text
                      style={[styles.font10,{ marginTop: 5, marginLeft: 16 }]}
                    >
                      T.No:
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.leftBorder,
                      styles.bottomBorder,
                    ]}
                  >
                    <Text style={[styles.font10]}>
                      Sign: ______________
                    </Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>Name: _____________</Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>
                      Design: _____________
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.leftBorder,
                      styles.rightBorder,
                      styles.bottomBorder,
                    ]}
                  >
                    <Text style={[styles.font10]}>Sign: ______________</Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>Name: _____________</Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>
                      Design: _____________
                    </Text>
                  </View>
                </View>
              </View>

              {/* 8th Row with Remarks*/}
              <View style={styles.tablewithoutborder}>
                <View style={styles.tableRow}>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell17_5,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 130 },
                    ]}
                  >
                    <Text style={[styles.font12,{ marginTop: "1" }]}>
                      13. Taken Out By
                    </Text>
                    <Text style={[styles.font10,{ marginTop: "10" }]}>
                      Sign: __________________
                    </Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>Name: _________________</Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>
                      Design: _________________
                    </Text>
                    <Text style={[styles.font10,{marginTop: 10}]}>
                      MCF Emp : YES / NO
                    </Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>
                      Co (if available):
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell17_5,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 130 },
                    ]}
                  >
                    <Text style={[styles.font12,{ marginTop: "1" }]}>
                      14. Brought In By
                    </Text>
                    <Text style={[styles.font10,{ marginTop: "10" }]}>
                      Sign: __________________
                    </Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>Name: _________________</Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>
                      Design: _________________
                    </Text>
                    <Text style={[styles.font10,{marginTop: 10}]}>
                      MCF Emp : YES / NO
                    </Text>
                    <Text style={[styles.font10,{marginTop: 8}]}>
                      Co (if available):
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell20,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 130 },
                    ]}
                  >
                    <Text style={[styles.font12,{ marginTop: "1" }]}>
                      15. Received in the Dept
                    </Text>
                    <Text style={[styles.font10,{ marginTop: 15 }]}>
                      By: _____________________
                    </Text>
                    <Text style={[styles.font10,{ marginTop: 12 }]}>
                      Sign: ____________________
                    </Text>
                    <Text style={[styles.font10,{marginTop: 12}]}>Name: ___________________</Text>
                    <Text style={[styles.font10,{marginTop: 12}]}>
                      Design: ___________________
                    </Text>
                    
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell15,
                      styles.leftBorder,
                      styles.bottomBorder,
                      { height: 130 },
                    ]}
                  >
                    <Text style={[styles.font12,{ marginTop: "1" }]}>
                      16.
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tableCell,
                      styles.cell30,
                      styles.leftBorder,
                      styles.bottomBorder,
                      styles.rightBorder,
                      { height: 130 },
                    ]}
                  >
                    <Text style={[styles.font12,{ marginTop: "3" }]}>
                      20. Remarks
                    </Text>
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
