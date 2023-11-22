import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { updateInvoice } from "../redux/invoicesSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const avilabledata = (data) => {
  return data.map((el) => {
    return {
      id: el.id,
      currentDate: el.currentDate,
      invoiceNumber: el.invoiceNumber,
      dateOfIssue: el.dateOfIssue,
      billTo: el.billTo,
      billToEmail: el.billToEmail,
      billToAddress: el.billToAddress,
      billFrom: el.billFrom,
      billFromEmail: el.billFromEmail,
      billFromAddress: el.billFromAddress,
      notes: el.notes,
      taxRate: el.taxRate,
      discountRate: el.discountRate,
      currency: el.currency,
    };
  });
};

const handleCalculateTotal = (prevFormData) => {
  let subTotal = 0;

  prevFormData.items.forEach((item) => {
    subTotal +=
      parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
  });

  const taxAmount = parseFloat(subTotal * (prevFormData.taxRate / 100)).toFixed(
    2
  );
  const discountAmount = parseFloat(
    subTotal * (prevFormData.discountRate / 100)
  ).toFixed(2);
  const total = (
    subTotal -
    parseFloat(discountAmount) +
    parseFloat(taxAmount)
  ).toFixed(2);

  return {
    ...prevFormData,
    subTotal: parseFloat(subTotal).toFixed(2),
    taxAmount,
    discountAmount,
    total,
  };
};
const EditableTable = () => {
  const { invoiceList } = useInvoiceListData();
  const editableData = avilabledata(invoiceList);
  const dispatch = useDispatch();
  const notify = () => toast("Wow so easy !");
  // console.log(avilabledata(invoiceList), "bulk");

  const EditTablecell = (rowIndex, key, value, obkey) => {
    const data = { ...invoiceList[rowIndex], [obkey]: value };
    // we paassing updated data along with id through the dispatch function method
    dispatch(
      updateInvoice({ id: key.id, updatedInvoice: handleCalculateTotal(data) })
    );
    const ind = invoiceList[rowIndex];
    setTimeout(() => {
      toast.success(`Data Upteded Successfly ${ind[obkey]} to ${value} `, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }, 400);
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex align-items-center mynav">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>
      <h3 className="fw-bold pb-2 pb-md-4 text-center">Bulk Edit page</h3>
      <div className="table-container">
        <table className="responsive-table ">
          <thead>
            <tr>
              {Object.keys(editableData[0])?.map((key) => (
                <th key={key} className="table-header" scope="col">
                  {capitalizeFirstLetter(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editableData?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((key) => (
                  <td key={key} className="table-cell">
                    {key !== "id" ? (
                      <div
                        contentEditable="true"
                        onBlur={(e) =>
                          EditTablecell(rowIndex, row, e.target.innerText, key)
                        }
                      >
                        {row[key]}
                      </div>
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EditableTable;
