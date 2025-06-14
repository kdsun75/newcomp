import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Modal from '../Modal';
import CreatePost from '../CreatePost';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleWriteClick = () => {
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = async () => {
    setIsPostModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} onWriteClick={handleWriteClick} />
        
        <main className="flex-1 md:ml-64">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <Modal isOpen={isPostModalOpen} onClose={handleClosePostModal}>
          <CreatePost onPostCreated={handleClosePostModal} />
        </Modal>
      </div>
    </div>
  );
};

export default Layout; 