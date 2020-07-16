import React, {useEffect, useState} from 'react';
import './App.css';
import { useFormik } from 'formik';
import * as dynamoose from "dynamoose";
const config        = require('./aws.js');

const App = () => {
    const formik = useFormik({
        initialValues: {
        busName: '',
        busAddress: '',
        busEmail: '',
        busTel: '',
        },
        onSubmit: values => {
        // alert(JSON.stringify(values, null, 2));
            addNewBusiness(values)
        },
      });

    const [busList, setBusList] = useState([]);

    const busSchema = new dynamoose.Schema({
        "busName": String,
        "busAddress": String,
        "busEmail": String,
        "busTel": {
            "type": String,
            "required": false
        }
    }, {
        "timestamps": true
    });

    const Business = dynamoose.model(
        "Business",
        busSchema,
        {"create": false});

    dynamoose.aws.ddb.set(config);

    const addNewBusiness = async (data) => {
        const business = new Business({
            "busName": data.busName,
            "busAddress": data.busAddress,
            "busEmail": data.busEmail,
            "busTel": data.busTel
        });
        await business.save();
        await getBusinesses();
    };

    const getBusinesses = async () => {
        Business.scan().exec()
            .then((bus) => {
                setBusList(bus.map(B=>B));
        });
    };

    useEffect(()=> {
        const getList = async () => {
           await getBusinesses();
        }
        getList();
    },[]);

    return (
        <div className="App">
            <div className={'businesses'}>
                <table id="customers">
                    <tr>
                        <th>Bus. Name</th>
                        <th>Bus. Address</th>
                        <th>Bus. Email</th>
                        <th>Bus. Phone</th>
                    </tr>
                {busList.map((L,i)=> {
                    return(
                            <tr key={i}>
                                <td>{L.busName}</td>
                                <td>{L.busAddress}</td>
                                <td>{L.busEmail}</td>
                                <td>{L.busTel}</td>
                            </tr>
                    )
                })}
                </table>
            </div>

            <div className="form-style-10">
                <h1>Add a business<span>Tell us about your business</span></h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="section">Business Name & Address</div>
                    <div className="inner-wrap">
                        <label htmlFor="busName">
                            Business Name
                        </label>
                        <input
                            type="text"
                            name="busName"
                            required
                            onChange={formik.handleChange}
                            value={formik.values.busName}
                        />
                        <label htmlFor="busAddress">
                            Business Address
                        </label>
                        <textarea name="busAddress"
                                  required
                                  onChange={formik.handleChange}
                                  value={formik.values.busAddress}>
                        </textarea>
                    </div>
                    <div className="section">Business Email & Phone</div>
                        <div className="inner-wrap">
                          <label htmlFor="busEmail">Email</label>
                          <input type="email"
                                 required
                                 name="busEmail"
                                 onChange={formik.handleChange}
                                 value={formik.values.busEmail}
                          />
                          <label htmlFor="busTel">Phone (optional)</label>
                          <input type="tel"
                                 pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                 placeholder={"123-456-7890"}
                                 name="busTel"
                                 onChange={formik.handleChange}
                                 value={formik.values.busTel}
                          />
                        </div>
                    <div className="button-section">
                        <input type="submit" name="Add"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
