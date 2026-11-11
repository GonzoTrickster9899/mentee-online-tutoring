import React from 'react';
import {
    FaEnvelope,
    FaHeadphones,
    FaLocationDot,
    FaPhone,
} from "react-icons/fa6";

const Contact = () => {
    return (
        <section className="max-padd-container my-24">
            {/* Contact Form and Details */}
            <div className="flex flex-col xl:flex-row gap-20 py-6">
                {/* Contact Form */}
                <div>
                    {/* Title */}
                    <div className="max-w-lg pb-16">
                        <h3 className="h3 capitalize">
                            Get <span className="font-[400]">in Touch</span>
                        </h3>
                        <p>
                            This page is informational. A contact-submission service has not been configured yet, so messages entered here would not be sent.
                        </p>
                    </div>
                    <div aria-label="Contact form unavailable" className="rounded bg-white p-4 ring-1 ring-slate-900/5">
                        <div className="flex gap-x-5">
                            <div className="w-1/2 mb-4">
                                <p className="text-sm text-gray-600">Contact form unavailable</p>
                            </div>
                            <div className="w-1/2 mb-4" />
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div>
                    {/* Title */}
                    <div className="max-w-lg pb-16">
                        <h3 className="h3 capitalize">
                            Contact <span className="font-[400]">Details</span>
                        </h3>
                        <p>
                            We are always here to assist you! Feel free to reach out to us through the following methods
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                            <h5 className="h5 capitalize mr-4">location:</h5>
                            <p className="flextStart gap-x-2">
                                <FaLocationDot /> 65, Aglipay St, Mandaluyong City, Metro Manila
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <h5 className="h5 capitalize mr-4">email:</h5>
                            <p className="flexStart gap-x-2">
                                <FaEnvelope /> lancelotoleriana02@gmail.com
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <h5 className="h5 capitalize mr-4">phone:</h5>
                            <p className="flexStart gap-x-2">
                                <FaPhone /> +63 956 875 7828
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <h5 className="h5 capitalize mr-4">Support:</h5>
                            <p className="flexStart gap-x-2">
                                <FaHeadphones /> 24/7 Support is open
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            
        </section>
    )
}

export default Contact;
