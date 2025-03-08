import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout/Layout';
import { FiAlertTriangle, FiExternalLink } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>About - Cursor Changelog</title>
        <meta name="description" content="About Cursor Changelog and disclaimer information" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-blue-400 text-transparent bg-clip-text">About Cursor Changelog</h1>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-400">Disclaimer</h2>
          <div className="border-l-4 border-red-500 bg-red-950/30 p-4 mb-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-400">Important Disclaimer</h3>
                <div className="mt-2 text-sm text-red-300">
                  <p><strong>Cursor Changelog is NOT affiliated with, endorsed by, or connected to Cursor in any way.</strong></p>
                  <p className="mt-1">This is an independent service created by a third-party to provide notifications about publicly available information regarding Cursor updates.</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="mb-4 text-cursor-light">
            Cursor Changelog is a community-created tool that monitors for publicly available Cursor updates 
            and allows users to receive notifications via various channels. The service operates independently and is not:
          </p>
          
          <ul className="list-disc ml-8 mb-4 space-y-2 text-cursor-light">
            <li>Responsible for releasing Cursor updates</li>
            <li>Affiliated with the Cursor development team</li>
            <li>An official source of Cursor information</li>
            <li>Endorsed or supported by Cursor</li>
          </ul>
          
          <p className="mb-4 text-cursor-light">
            All information about Cursor updates is collected from publicly available sources. 
            This service simply makes that information more accessible by providing notification options.
          </p>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-400">About This Service</h2>
          
          <p className="mb-4 text-cursor-light">
            Cursor Changelog was created to help Cursor users stay informed about the latest updates 
            to the Cursor editor. The service regularly checks for new versions and notifies users through 
            their preferred channels.
          </p>
          
          <p className="mb-4 text-cursor-light">
            Currently supported notification channels:
          </p>
          
          <ul className="list-disc ml-8 mb-4 text-cursor-light">
            <li>Slack</li>
            <li>Telegram</li>
          </ul>
          
          <p className="text-cursor-light flex items-center">
            For the official Cursor website and information, please visit 
            <a 
              href="https://www.cursor.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 mx-1 flex items-center"
            >
              cursor.com
              <FiExternalLink className="ml-1" size={14} />
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 