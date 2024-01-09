'use client'
import { useEffect, useState } from 'react'

interface Job {
  id: number;
  key: string;
  reference: string | null;
  board: {
    key: string;
    name: string;
    type: string;
    subtype: string;
    environment: string;
  };
  board_key: string;
  name: string;
  url: string | null;
  picture: null;
  summary: string;
  location: {
    text: string;
    lat: number;
    lng: number;
    gmaps: null;
    fields: [];
  };
  archive: null;
  archived_at: null;
  updated_at: string;
  created_at: string;
  sections: [];
  culture: null;
  responsibilities: null;
  requirements: null;
  benefits: null;
  interviews: null;
  skills: { name: string; value: null; type: null }[];
  languages: { name: string; value: null }[];
  certifications: { name: string; value: null; type: null }[];
  courses: [];
  tasks: { name: string; value: null; type: null }[];
  interests: [];
  tags: { name: string; value: string }[];
  metadatas: [];
  ranges_float: [];
  ranges_date: { name: string; value_min: string; value_max: string }[];
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'askr_dbfb6f33e7d3c6b6e334b2d420f81465',
          },
        };
        const response = await fetch('https://api.hrflow.ai/v1/jobs/searching?page=1&limit=30&order_by=desc&board_keys=["887595b735d68f0bc0b0b0535f7d8f7d158a3f4e"]', options)
        const data = await response.json()
        if (response.ok) {
          setJobs(data.data.jobs)
        } else {
          console.error(`Request error: ${data.message}`)
        }
      } catch (error) {
        console.error('Error while fetching data', error)
      }
    }
    fetchData()
  }, [])
  return (
    <div>
      <h1>Liste des emplois</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h2>{job.name}</h2>
            <p>{job.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JobList
