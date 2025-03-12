import React, { useState, useEffect } from 'react';

const GenericUpdateComponent = ({ userId, updateConfig, additional = 0, onClose }) => {
  const [formValues, setFormValues] = useState({});
  const [enumOptions, setEnumOptions] = useState({});
  const [responseMessage, setResponseMessage] = useState('');

  // Initialize form values for all fields in updateConfig.
  useEffect(() => {
    const initialValues = {};
    updateConfig.fields.forEach(field => {
      initialValues[field.name] = '';
    });
    setFormValues(initialValues);
  }, [updateConfig]);

  // For fields of type 'enum', fetch the available options.
  useEffect(() => {
    updateConfig.fields.forEach(field => {
      if (field.type === 'enum') {
        if (field.fetchEnumUrl) {
          fetch(field.fetchEnumUrl)
            .then(res => res.json())
            .then(data => {
              setEnumOptions(prev => ({
                ...prev,
                [field.name]: data,
              }));
            })
            .catch(err => console.error(`Error fetching options for ${field.name}:`, err));
        } else if (field.name === 'incomeType') {
          // Hard-coded enum options
          setEnumOptions(prev => ({
            ...prev,
            [field.name]: ['SELF_EMPLOYED', 'SALARIED', 'UNEMPLOYED']
          }));
        }
      }
    });
  }, [updateConfig.fields]);

  const handleChange = (e, fieldName) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formValues };

    // Build the URL including the "additional" parameter.
    const url = updateConfig.apiUrl 
      ? `${updateConfig.apiUrl}&additional=${additional}` 
      : `http://localhost:8080/api/userbot/query?prompt_id=${updateConfig.promptId}&userId=${userId}&additional=${additional}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data && data.success) {
        setResponseMessage(data.message || "Record updated successfully!");
      } else {
        setResponseMessage("Update failed!");
      }
    } catch (error) {
      console.error("Error during update:", error);
      setResponseMessage("Error occurred during update.");
    }
  };

  return (
    <div className="generic-update-component" style={styles.container}>
      <h2>{updateConfig.title}</h2>
      <form onSubmit={handleSubmit}>
        {updateConfig.fields.map(field => (
          <div key={field.name} className="form-group" style={styles.formGroup}>
            <label htmlFor={field.name} style={styles.label}>{field.label}</label>
            {field.type === 'enum' ? (
              <select
                id={field.name}
                value={formValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                style={styles.select}
              >
                <option value="">{field.placeholder || `Select ${field.label}`}</option>
                {field.name === 'incomeType'
                  ? ['SELF_EMPLOYED', 'SALARIED', 'UNEMPLOYED'].map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))
                  : enumOptions[field.name] && enumOptions[field.name].map((option, idx) => {
                      const value = typeof option === 'object' ? option.value : option;
                      const display = typeof option === 'object' ? option.label : option;
                      return (
                        <option key={idx} value={value}>
                          {display}
                        </option>
                      );
                    })
                }
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                value={formValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                placeholder={field.placeholder || `Enter ${field.label}`}
                style={styles.input}
              />
            )}
          </div>
        ))}
        <button type="submit" style={styles.button}>Submit Update</button>
      </form>
      {responseMessage && <p style={styles.responseMessage}>{responseMessage}</p>}
      <button onClick={onClose} style={styles.closeButton}>Close</button>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '1rem',
    margin: '1rem',
    background: '#fff',
    borderRadius: '8px',
    maxWidth: '400px'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem'
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem'
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    marginRight: '0.5rem',
    cursor: 'pointer'
  },
  closeButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    marginTop: '1rem',
    background: '#eee',
    cursor: 'pointer'
  },
  responseMessage: {
    marginTop: '1rem',
    fontStyle: 'italic'
  }
};

export default GenericUpdateComponent;