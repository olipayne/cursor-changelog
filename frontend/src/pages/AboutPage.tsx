import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - Cursor Change Alerter</title>
        <meta name="description" content="About Cursor Change Alerter and disclaimer information" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About Cursor Change Alerter</h1>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
          <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Important Disclaimer</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p><strong>Cursor Change Alerter is NOT affiliated with, endorsed by, or connected to Cursor in any way.</strong></p>
                  <p className="mt-1">This is an independent service created by a third-party to provide notifications about publicly available information regarding Cursor updates.</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="mb-4">
            Cursor Change Alerter is a community-created tool that monitors for publicly available Cursor updates 
            and allows users to receive notifications via various channels. The service operates independently and is not:
          </p>
          
          <ul className="list-disc ml-8 mb-4 space-y-2">
            <li>Responsible for releasing Cursor updates</li>
            <li>Affiliated with the Cursor development team</li>
            <li>An official source of Cursor information</li>
            <li>Endorsed or supported by Cursor</li>
          </ul>
          
          <p className="mb-4">
            All information about Cursor updates is collected from publicly available sources. 
            This service simply makes that information more accessible by providing notification options.
          </p>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Service</h2>
          
          <p className="mb-4">
            Cursor Change Alerter was created to help Cursor users stay informed about the latest updates 
            to the Cursor editor. The service regularly checks for new versions and notifies users through 
            their preferred channels.
          </p>
          
          <p className="mb-4">
            Currently supported notification channels:
          </p>
          
          <ul className="list-disc ml-8 mb-4">
            <li>Slack</li>
            <li>Telegram</li>
          </ul>
          
          <p>
            For the official Cursor website and information, please visit 
            <a 
              href="https://www.cursor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 mx-1"
            >
              cursor.com
            </a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 