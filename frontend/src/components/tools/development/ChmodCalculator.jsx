import React, { useState, useEffect } from 'react';
import { CommandLineIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'chmod-calculator',
  name: 'Chmod Calculator',
  description: 'Calculate Unix file permissions',
  category: 'dev',
  path: '/tools/development/chmod-calculator',
  icon: CommandLineIcon,
  order: 2,
};

const ChmodCalculator = () => {
  // Default permissions: rw-r--r-- (644)
  const [permissions, setPermissions] = useState({
    user: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
    special: { setuid: false, setgid: false, sticky: false }
  });
  
  const [numericValue, setNumericValue] = useState('644');
  const [symbolicNotation, setSymbolicNotation] = useState('rw-r--r--');
  const [commandText, setCommandText] = useState('chmod 644 filename');

  // Update numeric and symbolic values when permissions change
  useEffect(() => {
    updateNumericAndSymbolic();
  }, [permissions]);

  // Update checkboxes when numeric value is entered directly
  useEffect(() => {
    if (numericValue.length > 0) {
      updatePermissionsFromNumeric(numericValue);
    }
  }, [numericValue]);

  const updateNumericAndSymbolic = () => {
    // Calculate numeric value
    let numeric = '';
    
    // Special permissions (first digit)
    const specialValue = 
      (permissions.special.setuid ? 4 : 0) + 
      (permissions.special.setgid ? 2 : 0) + 
      (permissions.special.sticky ? 1 : 0);
    
    if (specialValue > 0) {
      numeric += specialValue.toString();
    }
    
    // User permissions (first/second digit)
    const userValue = 
      (permissions.user.read ? 4 : 0) + 
      (permissions.user.write ? 2 : 0) + 
      (permissions.user.execute ? 1 : 0);
    numeric += userValue.toString();
    
    // Group permissions (second/third digit)
    const groupValue = 
      (permissions.group.read ? 4 : 0) + 
      (permissions.group.write ? 2 : 0) + 
      (permissions.group.execute ? 1 : 0);
    numeric += groupValue.toString();
    
    // Others permissions (third/fourth digit)
    const othersValue = 
      (permissions.others.read ? 4 : 0) + 
      (permissions.others.write ? 2 : 0) + 
      (permissions.others.execute ? 1 : 0);
    numeric += othersValue.toString();
    
    setNumericValue(numeric);
    setCommandText(`chmod ${numeric} filename`);
    
    // Calculate symbolic notation
    let symbolic = '';
    
    // User
    symbolic += permissions.user.read ? 'r' : '-';
    symbolic += permissions.user.write ? 'w' : '-';
    symbolic += permissions.user.execute 
      ? (permissions.special.setuid ? 's' : 'x') 
      : (permissions.special.setuid ? 'S' : '-');
    
    // Group
    symbolic += permissions.group.read ? 'r' : '-';
    symbolic += permissions.group.write ? 'w' : '-';
    symbolic += permissions.group.execute 
      ? (permissions.special.setgid ? 's' : 'x') 
      : (permissions.special.setgid ? 'S' : '-');
    
    // Others
    symbolic += permissions.others.read ? 'r' : '-';
    symbolic += permissions.others.write ? 'w' : '-';
    symbolic += permissions.others.execute 
      ? (permissions.special.sticky ? 't' : 'x') 
      : (permissions.special.sticky ? 'T' : '-');
    
    setSymbolicNotation(symbolic);
  };

  const updatePermissionsFromNumeric = (value) => {
    // Handle 3 or 4 digit formats
    const digits = value.replace(/[^0-7]/g, '').split('').map(Number);
    
    if (digits.length < 3 || digits.some(d => d === undefined)) {
      return;
    }
    
    let userDigit, groupDigit, othersDigit, specialDigit;
    
    if (digits.length === 4) {
      [specialDigit, userDigit, groupDigit, othersDigit] = digits;
    } else {
      [userDigit, groupDigit, othersDigit] = digits;
      specialDigit = 0;
    }
    
    // Set permissions based on numeric value
    setPermissions({
      user: {
        read: !!(userDigit & 4),
        write: !!(userDigit & 2),
        execute: !!(userDigit & 1)
      },
      group: {
        read: !!(groupDigit & 4),
        write: !!(groupDigit & 2),
        execute: !!(groupDigit & 1)
      },
      others: {
        read: !!(othersDigit & 4),
        write: !!(othersDigit & 2),
        execute: !!(othersDigit & 1)
      },
      special: {
        setuid: !!(specialDigit & 4),
        setgid: !!(specialDigit & 2),
        sticky: !!(specialDigit & 1)
      }
    });
  };

  const handlePermissionChange = (category, permission) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission]
      }
    }));
  };

  const handleNumericInput = (e) => {
    const value = e.target.value.replace(/[^0-7]/g, '').substring(0, 4);
    setNumericValue(value);
  };

  // Permission explanations
  const getPermissionExplanation = () => {
    const { user, group, others, special } = permissions;
    const explanations = [];
    
    // Helper function to generate consistent permission descriptions
    const describePermissions = (entity, entityName) => {
      if (entity.read && entity.write && entity.execute) {
        explanations.push(`${entityName} can read, write, and execute`);
      } else if (entity.read && entity.write) {
        explanations.push(`${entityName} can read and write`);
      } else if (entity.read && entity.execute) {
        explanations.push(`${entityName} can read and execute`);
      } else if (entity.write && entity.execute) {
        explanations.push(`${entityName} can write and execute`);
      } else if (entity.read) {
        explanations.push(`${entityName} can only read`);
      } else if (entity.write) {
        explanations.push(`${entityName} can only write`);
      } else if (entity.execute) {
        explanations.push(`${entityName} can only execute`);
      } else {
        explanations.push(`${entityName} has no permissions`);
      }
    };
    
    // Apply the helper function to each permission category
    describePermissions(user, "User");
    describePermissions(group, "Group");
    describePermissions(others, "Others");
    
    // Handle special permissions (already concise)
    if (special.setuid) explanations.push("Set User ID: When executed, program runs as the user that owns it");
    if (special.setgid) explanations.push("Set Group ID: When executed, program runs with the privileges of the group");
    if (special.sticky) explanations.push("Sticky bit: Only file owner can rename or delete the file");
    
    return explanations;
  };

  const PermissionCheckbox = ({ label, checked, onChange, className = "" }) => (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-2 h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
      />
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
    </div>
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <CommandLineIcon className="h-6 w-6 mr-2" />
        Chmod Calculator
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {/* Permissions Matrix */}
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300 font-medium">Permission</th>
                  <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-300 font-medium">User</th>
                  <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-300 font-medium">Group</th>
                  <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-300 font-medium">Others</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-300">Read (4)</td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.user.read}
                      onChange={() => handlePermissionChange('user', 'read')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.group.read}
                      onChange={() => handlePermissionChange('group', 'read')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.others.read}
                      onChange={() => handlePermissionChange('others', 'read')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-300">Write (2)</td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.user.write}
                      onChange={() => handlePermissionChange('user', 'write')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.group.write}
                      onChange={() => handlePermissionChange('group', 'write')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.others.write}
                      onChange={() => handlePermissionChange('others', 'write')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-gray-800 dark:text-gray-300">Execute (1)</td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.user.execute}
                      onChange={() => handlePermissionChange('user', 'execute')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.group.execute}
                      onChange={() => handlePermissionChange('group', 'execute')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={permissions.others.execute}
                      onChange={() => handlePermissionChange('others', 'execute')}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Special Permissions */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Special Permissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <PermissionCheckbox
                label="SUID (4)"
                checked={permissions.special.setuid}
                onChange={() => handlePermissionChange('special', 'setuid')}
              />
              <PermissionCheckbox
                label="SGID (2)"
                checked={permissions.special.setgid}
                onChange={() => handlePermissionChange('special', 'setgid')}
              />
              <PermissionCheckbox
                label="Sticky (1)"
                checked={permissions.special.sticky}
                onChange={() => handlePermissionChange('special', 'sticky')}
              />
            </div>
          </div>

          {/* Numeric Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Numeric (Octal) Value
            </label>
            <input
              type="text"
              value={numericValue}
              onChange={handleNumericInput}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              maxLength="4"
              placeholder="644"
            />
          </div>
        </div>

        <div>
          {/* Results and Explanations */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Symbolic Notation</h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-lg text-center">
              {symbolicNotation}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Command</h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono">
              {commandText}
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Explanation</h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {getPermissionExplanation().map((explanation, index) => (
                  <li key={index}>{explanation}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-1"><strong>r</strong> (read): View file contents or list directory contents</p>
        <p className="mb-1"><strong>w</strong> (write): Modify files or create/delete files in directory</p>
        <p className="mb-1"><strong>x</strong> (execute): Execute files or access files within directory</p>
        <p>Common permission patterns: 755 (rwxr-xr-x), 644 (rw-r--r--), 777 (rwxrwxrwx), 600 (rw-------)</p>
      </div>
    </div>
  );
};

export default ChmodCalculator;