import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import TreeSelectField from "./TreeSelectField";
import { useIndexedDB } from "react-indexed-db-hook";
import { Link, useParams, generatePath, useNavigate } from "react-router-dom";
import { flatten } from "./utils";

export default function CreateEdit() {
  let { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const db = useIndexedDB("Selector");

  const [allSelectors, setAllSelectors] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    sector: "",
    agree: false,
  });

  const formik = useFormik({
    initialValues: { ...initialValues },
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup.string().required(),
      sector: yup.string().required(),
      agree: yup.boolean().required(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        isEdit
          ? await db.update({ ...values })
          : await db.add({
              name: values.name,
              sector: values.sector,
              agree: values.agree,
            });

        const allSelector = await db.getAll();
        setAllSelectors(allSelector || []);

        resetForm();
        setInitialValues({
          name: "",
          sector: "",
          agree: false,
        });
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    db.getByID(Number(id)).then((selectorData) => {
      selectorData !== undefined && setInitialValues(selectorData);
    });
  }, [id]);

  useEffect(() => {
    db.getAll().then((selectorData) => {
      setAllSelectors(selectorData || []);
    });
  }, []);

  return (
    <div>
      <Typography variant="h3" fontWeight={600} mb={10}>
        {isEdit ? `Edit ${id}` : "Create New"}
      </Typography>

      <Card variant="outlined">
        <Box py={3} px={3}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="dense"
              label="Name"
              {...formik.getFieldProps(`name`)}
              value={formik.values?.name || ""}
              error={!!formik.errors?.name}
              helperText={formik.errors?.name}
              fullWidth
            />
            <TreeSelectField
              fullWidth
              autoFocus
              formik={formik}
              name="sector"
              margin="dense"
              data={data}
              label="Sectors"
              error={!!formik.errors?.sector}
              helperText={formik.errors?.sector}
            />

            <FormControlLabel
              mt={10}
              control={
                <Checkbox
                  checked={formik.values?.agree}
                  onChange={(event) => {
                    formik.setFieldValue(`agree`, event.target.checked);
                  }}
                />
              }
              helperText={""}
              label="Agree to terms"
            />
            <FormHelperText style={{ textAlign: "center" }} error>
              {formik.errors?.agree}
            </FormHelperText>

            <Box my={5} />
            <Button type="submit" variant="contained" fullWidth>
              {isEdit ? "Update" : "save"}
            </Button>
          </form>
        </Box>
      </Card>

      <Box component="hr" my={5} />

      <ul>
        {allSelectors?.map((selectorData) => (
          <li key={selectorData?.id}>
            (name: {selectorData?.name}) -(selector:
            {
              flatten([], data)?.find(
                ({ id }) => Number(selectorData?.id) === Number(id)
              )?.name
            }
            ) - <Link to={`/edit/${selectorData?.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const data = [
  {
    id: "1",
    name: "Manufacturing",
    children: [
      {
        id: "19",
        name: "Construction materials",
      },
      {
        id: "18",
        name: "Electronics and Optics",
      },
      {
        id: "6",
        name: "Food and Beverage",
        children: [
          {
            id: "342",
            name: "Bakery &amp; confectionery products",
          },
          {
            id: "43",
            name: "Beverages",
          },
          {
            id: "42",
            name: "Fish &amp; fish products",
          },
          {
            id: "40",
            name: "Meat &amp; meat products",
          },
          {
            id: "39",
            name: "Milk &amp; dairy products",
          },
          {
            id: "437",
            name: "Other",
          },
          {
            id: "437",
            name: "Other",
          },
          {
            id: "378",
            name: "Sweets &amp; snack food",
          },
        ],
      },
      {
        id: "13",
        name: "Furniture",
        children: [
          {
            id: "389",
            name: "Bathroom/sauna",
          },
          {
            id: "385",
            name: "Bedroom",
          },
          {
            id: "390",
            name: "Children’s room",
          },
          {
            id: "98",
            name: "Kitchen",
          },
          {
            id: "101",
            name: "Living room",
          },
          {
            id: "392",
            name: "Office",
          },
          {
            id: "394",
            name: "Other (Furniture)",
          },
          {
            id: "341",
            name: "Outdoor",
          },
          {
            id: "99",
            name: "Project furniture",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Other",
    children: [
      {
        id: "37",
        name: "Creative industries",
      },
      {
        id: "29",
        name: "Energy technology",
      },
      {
        id: "33",
        name: "Environment",
      },
      {
        id: "2",
        name: "Service",
      },
      {
        id: "25",
        name: "Business services",
      },
    ],
  },
];
