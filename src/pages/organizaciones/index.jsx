import '../dashboard/styles.css';
import DashboardLayout from "../dashboard/layout";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import PopUp from '@/components/popUps/popUp';
import Alerts from '@/components/alerts/alerts';
import { useSession } from 'next-auth/react';
import { Trash, FilePenLine } from 'lucide-react';

function Organizaciones () {
  

  return(
    <DashboardLayout>
      <div className="flex items-center justify-between px-8 pt-6">
        
      </div>
    </DashboardLayout>
  )
}

export default withAuth(Organizaciones, ['superadmin'])
