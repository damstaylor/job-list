import { useEffect, useMemo, useState } from 'react'
import SearchBar from './SearchBar'
import MultipleSelectChip from './MultipleSelectChip'
import { Card, CardContent, Typography, SelectChangeEvent } from '@mui/material'
import Job from '../interfaces/Job'
import Meta from '../interfaces/Meta'
import snakify from '../utils/utils'
import SelectOption from '../interfaces/SelectOption'

const JobList: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const getTagValue = (job: Job, tagName: string): string => {
    const tag = job.tags?.find((tag) => tag.name.toLowerCase() === tagName)
    return tag?.value ?? ''
  }
  const handleSearchValue = (newValue: string) => {
    setSearchValue(newValue)
  }
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const JOB_CATEGORIES_API = [
    'AI / Research & Development',
    'Artificial Intelligence',
    'Financial Services',
    'Human Resources',
    'Software Engineering',
  ]
  const jobCategoryOptions = JOB_CATEGORIES_API.map((cat) => ({
    label: cat,
    value: snakify(cat),
  })) as SelectOption[]
  const handleSelectedCategoriesChange = (e: SelectChangeEvent) => {
    console.log(e.target.value)
    setSelectedCategories(e?.target?.value as unknown as string[])
  }
  const filteredJobs = useMemo(() => {
    const lowerCaseSearchValue = searchValue.toLowerCase()
    const jobsInSelectedCategories = selectedCategories.length > 0 ?
      jobs.filter((job) => selectedCategories.includes(snakify(getTagValue(job, 'category')))) :
      jobs
    return searchValue !== '' ?
      jobsInSelectedCategories.filter(job => job.name.toLowerCase().includes(lowerCaseSearchValue)) :
      jobsInSelectedCategories
  }, [searchValue, jobs, selectedCategories])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { REACT_APP_API_KEY, REACT_APP_BASE_URL, REACT_APP_BOARD_KEYS } = process.env
        const sortOrder: string = 'desc'
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': REACT_APP_API_KEY,
          },
        } as RequestInit
        const url: string = `${REACT_APP_BASE_URL}/jobs/searching?page=1&limit=30&order_by=${sortOrder}&board_keys=${REACT_APP_BOARD_KEYS}`
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok) {
          setJobs(data.data.jobs)
          setMeta(data.meta)
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
    <div className="job-list">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <h1>Job list</h1>
        <SearchBar initValue={searchValue} onChange={handleSearchValue} />
        <MultipleSelectChip
          value={selectedCategories}
          options={jobCategoryOptions}
          onChange={handleSelectedCategoriesChange}
          label="Categories"
        />
        {filteredJobs.map((job) => (
          <Card key={job.id} className="min-h-full">
            <CardContent>
              <Typography variant="h4" component="div" className="mb-2">
                {job.name}
              </Typography>
              <Typography variant="h5" component="div" className="mb-2">
                {getTagValue(job, 'company')}
              </Typography>
              <Typography variant="h6" component="div" className="mb-2">
                {getTagValue(job, 'category')}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" className="mb-2">
                {job.location?.text} - {getTagValue(job, 'type')}
              </Typography>
              <Typography variant="h6" component="div" className="mb-2">
                {job.skills.map(tag => tag.name).join(', ')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {job.summary || 'No job description available :('}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {meta &&
          <footer>
            <div>{filteredJobs.length} out of {meta.count} results</div>
            <div>Page {meta.page}</div>
          </footer>}
      </div>
    </div>
  )
}

export default JobList
