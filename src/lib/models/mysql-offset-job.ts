import { query } from '../mysql';
import { OffsetPrintFormData } from '@/components/forms/OffsetPrintForm';

export interface OffsetPrintJob {
  id?: number;
  job_id: number;
  customer_id: number;
  job_number: string;
  job_name: string;
  quantity: number;
  delivery_date: string;
  notes: string;
  paper_supply_by_customer: boolean;
  paper_cutting_by_customer: boolean;
  paper_type?: string;
  paper_size?: string;
  paper_weight?: string;
  paper_finish?: string;
  paper_grain?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

// Create a new offset print job
export async function createOffsetPrintJob(jobData: Partial<OffsetPrintJob>): Promise<number | null> {
  try {
    // Insert the main job record
    const result = await query<any>(
      `INSERT INTO offset_print_jobs (
        job_id, customer_id, job_number, job_name, quantity, delivery_date, notes,
        paper_supply_by_customer, paper_cutting_by_customer, 
        paper_type, paper_size, paper_weight, paper_finish, paper_grain, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobData.job_id,
        jobData.customer_id,
        jobData.job_number || '',
        jobData.job_name,
        jobData.quantity,
        jobData.delivery_date,
        jobData.notes || '',
        jobData.paper_supply_by_customer || false,
        jobData.paper_cutting_by_customer || false,
        jobData.paper_type || null,
        jobData.paper_size || null,
        jobData.paper_weight || null,
        jobData.paper_finish || null,
        jobData.paper_grain || null,
        jobData.status || 'pending'
      ]
    );
    
    return result.insertId;
  } catch (error) {
    console.error('Error creating offset print job:', error);
    return null;
  }
}

// Convert form data to database format
export async function saveOffsetPrintJobFromForm(formData: OffsetPrintFormData, jobId: number, customerId: number): Promise<number | null> {
  try {
    console.log('Starting saveOffsetPrintJobFromForm with:', { 
      jobId, 
      customerId, 
      formDataKeys: Object.keys(formData)
    });
    
    // Validate the form data has expected fields
    if (!formData.jobName) {
      console.error('Form data missing jobName');
      throw new Error('Invalid form data: missing jobName');
    }

    // 1. Create the main offset print job record
    console.log('Creating main offset print job record with:', {
      jobId,
      customerId,
      jobNumber: formData.jobNumber,
      jobName: formData.jobName,
      quantity: formData.quantity,
      deliveryDate: formData.deliveryDate
    });
    
    const offsetJobId = await createOffsetPrintJob({
      job_id: jobId,
      customer_id: customerId,
      job_number: formData.jobNumber,
      job_name: formData.jobName,
      quantity: formData.quantity,
      delivery_date: formData.deliveryDate,
      notes: formData.notes,
      paper_supply_by_customer: formData.paperSupplyByCustomer,
      paper_cutting_by_customer: formData.paperCuttingByCustomer,
      paper_type: formData.paperType?.type,
      paper_size: formData.paperType?.size,
      paper_weight: formData.paperType?.weight,
      paper_finish: formData.paperType?.finish,
      paper_grain: formData.paperType?.grain,
      status: 'pending'
    });
    
    if (!offsetJobId) {
      console.error('Failed to create offset print job record');
      throw new Error('Failed to create offset print job record');
    }
    
    console.log('Offset job created with ID:', offsetJobId);
    
    // 2. Save selected colors
    try {
      console.log('Saving colors:', formData.colors);
      await saveOffsetJobColors(offsetJobId, formData.colors);
    } catch (error) {
      console.error('Error saving colors:', error);
      throw new Error(`Error saving colors: ${error.message}`);
    }
    
    // 3. Save paper items
    try {
      console.log('Saving paper items:', formData.paperItems);
      await saveOffsetJobPaperItems(offsetJobId, formData.paperItems);
    } catch (error) {
      console.error('Error saving paper items:', error);
      throw new Error(`Error saving paper items: ${error.message}`);
    }
    
    // 4. Save printing method
    try {
      console.log('Saving printing method:', formData.printingMethod);
      await saveOffsetJobPrintingMethod(offsetJobId, formData.printingMethod);
    } catch (error) {
      console.error('Error saving printing method:', error);
      throw new Error(`Error saving printing method: ${error.message}`);
    }
    
    // 5. Save laminating details
    try {
      console.log('Saving laminating:', formData.laminating);
      await saveOffsetJobLaminating(offsetJobId, formData.laminating);
    } catch (error) {
      console.error('Error saving laminating:', error);
      throw new Error(`Error saving laminating: ${error.message}`);
    }
    
    // 6. Save die cut details
    try {
      console.log('Saving die cut:', formData.dieCut);
      await saveOffsetJobDieCut(offsetJobId, formData.dieCut);
    } catch (error) {
      console.error('Error saving die cut:', error);
      throw new Error(`Error saving die cut: ${error.message}`);
    }
    
    // 7. Save bill book details
    try {
      console.log('Saving bill book:', formData.billBook);
      await saveOffsetJobBillBook(offsetJobId, formData.billBook);
    } catch (error) {
      console.error('Error saving bill book:', error);
      throw new Error(`Error saving bill book: ${error.message}`);
    }
    
    // 8. Save material supply details
    try {
      console.log('Saving material supply:', formData.materialSupply);
      await saveOffsetJobMaterialSupply(offsetJobId, formData.materialSupply);
    } catch (error) {
      console.error('Error saving material supply:', error);
      throw new Error(`Error saving material supply: ${error.message}`);
    }
    
    console.log('Successfully saved all offset job details');
    return offsetJobId;
  } catch (error) {
    console.error('Error saving offset print job from form:', error);
    return null;
  }
}

// Save color information
async function saveOffsetJobColors(offsetJobId: number, colors: OffsetPrintFormData['colors']): Promise<void> {
  try {
    // Create default colors object if not provided
    if (!colors) {
      colors = { black: true };
    }
    
    console.log('Saving colors:', colors);
    
    // First, get all selected colors
    const selectedColors = Object.entries(colors)
      .filter(([key, value]) => value === true && key !== 'customColor' && key !== 'customColorValue');
    
    console.log('Selected colors:', selectedColors);
    
    // Add each selected color to the database
    for (const [colorName] of selectedColors) {
      await query(
        'INSERT INTO offset_job_colors (offset_job_id, color_name, is_custom) VALUES (?, ?, ?)',
        [offsetJobId, colorName, false]
      );
    }
    
    // Handle custom color if selected
    if (colors.customColor) {
      const customColorValue = colors.customColorValue || '';
      await query(
        'INSERT INTO offset_job_colors (offset_job_id, color_name, is_custom, custom_color_value) VALUES (?, ?, ?, ?)',
        [offsetJobId, 'custom', true, customColorValue]
      );
    }
  } catch (error) {
    console.error('Error saving offset job colors:', error);
    throw error;
  }
}

// Save paper items
async function saveOffsetJobPaperItems(offsetJobId: number, paperItems: OffsetPrintFormData['paperItems']): Promise<void> {
  try {
    // Ensure paperItems is an array
    if (!paperItems || !Array.isArray(paperItems)) {
      paperItems = [];
    }
    
    console.log('Saving paper items:', paperItems);
    
    for (const item of paperItems) {
      if (!item) continue;
      
      const name = item.name || '';
      const qty = item.qty || 0;
      const cutSize = item.cutSize || '';
      const cutPerSheet = item.cutPerSheet || 0;
      
      await query(
        'INSERT INTO offset_job_paper_items (offset_job_id, name, qty, cut_size, cut_per_sheet) VALUES (?, ?, ?, ?, ?)',
        [offsetJobId, name, qty, cutSize, cutPerSheet]
      );
    }
  } catch (error) {
    console.error('Error saving offset job paper items:', error);
    throw error;
  }
}

// Save printing method
async function saveOffsetJobPrintingMethod(offsetJobId: number, printingMethod: OffsetPrintFormData['printingMethod']): Promise<void> {
  try {
    // Create default printing method object if not provided
    if (!printingMethod) {
      printingMethod = {
        paperSize: '',
        qty: 0,
        printingSystem: 'single',
        printImpression: { value1: 0, value2: 0, result: 0 }
      };
    }
    
    // Ensure printImpression object exists
    if (!printingMethod.printImpression) {
      printingMethod.printImpression = { value1: 0, value2: 0, result: 0 };
    }
    
    // Set defaults for any missing properties
    const paperSize = printingMethod.paperSize || '';
    const qty = printingMethod.qty || 0;
    const printingSystem = printingMethod.printingSystem || 'single';
    const value1 = printingMethod.printImpression.value1 || 0;
    const value2 = printingMethod.printImpression.value2 || 0;
    const result = printingMethod.printImpression.result || 0;
    
    console.log('Inserting printing method with values:', {
      offsetJobId,
      paperSize,
      qty,
      printingSystem,
      value1,
      value2,
      result
    });
    
    await query(
      `INSERT INTO offset_job_printing_methods (
        offset_job_id, paper_size, qty, printing_system, 
        impression_value1, impression_value2, impression_result
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        offsetJobId,
        paperSize,
        qty,
        printingSystem,
        value1,
        value2,
        result
      ]
    );
  } catch (error) {
    console.error('Error saving offset job printing method:', error);
    throw error;
  }
}

// Save laminating details
async function saveOffsetJobLaminating(offsetJobId: number, laminating: OffsetPrintFormData['laminating']): Promise<void> {
  try {
    // Create default laminating object if not provided
    if (!laminating) {
      laminating = {
        type: 'none',
        size: { width: 0, height: 0 },
        qty: 0,
        unitPrice: 0,
        result: 0
      };
    }
    
    // Ensure size object exists
    if (!laminating.size) {
      laminating.size = { width: 0, height: 0 };
    }
    
    // Set defaults for any missing properties
    const type = laminating.type || 'none';
    const height = laminating.size.height || 0;
    const width = laminating.size.width || 0;
    const qty = laminating.qty || 0;
    const unitPrice = laminating.unitPrice || 0;
    const result = laminating.result || 0;
    
    console.log('Inserting laminating with values:', {
      offsetJobId,
      type,
      height,
      width,
      qty,
      unitPrice,
      result
    });
    
    await query(
      `INSERT INTO offset_job_laminating (
        offset_job_id, type, height, width, qty, unit_price, result
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        offsetJobId,
        type,
        height,
        width,
        qty,
        unitPrice,
        result
      ]
    );
  } catch (error) {
    console.error('Error saving offset job laminating:', error);
    throw error;
  }
}

// Save die cut details
async function saveOffsetJobDieCut(offsetJobId: number, dieCut: OffsetPrintFormData['dieCut']): Promise<void> {
  try {
    // Create default die cut object if not provided
    if (!dieCut) {
      dieCut = {
        cutter: {
          newCutter: false,
          oldCutter: false,
          creasing: false,
          perforating: false,
          embossing: false,
          debossing: false
        },
        impression: {
          qty: 0,
          unitPrice: 0,
          result: 0,
          manualOverride: false
        }
      };
    }
    
    // Ensure sub-objects exist
    if (!dieCut.cutter) {
      dieCut.cutter = {
        newCutter: false,
        oldCutter: false,
        creasing: false,
        perforating: false,
        embossing: false,
        debossing: false
      };
    }
    
    if (!dieCut.impression) {
      dieCut.impression = {
        qty: 0,
        unitPrice: 0,
        result: 0,
        manualOverride: false
      };
    }
    
    // Set defaults for any missing properties
    const newCutter = dieCut.cutter.newCutter || false;
    const oldCutter = dieCut.cutter.oldCutter || false;
    const creasing = dieCut.cutter.creasing || false;
    const perforating = dieCut.cutter.perforating || false;
    const embossing = dieCut.cutter.embossing || false;
    const debossing = dieCut.cutter.debossing || false;
    const impressionQty = dieCut.impression.qty || 0;
    const impressionUnitPrice = dieCut.impression.unitPrice || 0;
    const impressionResult = dieCut.impression.result || 0;
    const manualOverride = dieCut.impression.manualOverride || false;
    
    console.log('Inserting die cut with values:', {
      offsetJobId,
      newCutter,
      oldCutter,
      creasing,
      perforating,
      embossing,
      debossing,
      impressionQty,
      impressionUnitPrice,
      impressionResult,
      manualOverride
    });
    
    await query(
      `INSERT INTO offset_job_die_cut (
        offset_job_id, new_cutter, old_cutter, creasing, perforating, embossing, debossing,
        impression_qty, impression_unit_price, impression_result, manual_override
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        offsetJobId,
        newCutter,
        oldCutter,
        creasing,
        perforating,
        embossing,
        debossing,
        impressionQty,
        impressionUnitPrice,
        impressionResult,
        manualOverride
      ]
    );
  } catch (error) {
    console.error('Error saving offset job die cut:', error);
    throw error;
  }
}

// Save bill book details
async function saveOffsetJobBillBook(offsetJobId: number, billBook: OffsetPrintFormData['billBook']): Promise<void> {
  try {
    // Create default bill book object if not provided
    if (!billBook) {
      billBook = {
        numberOfPapers: 0,
        details: {
          billNumbers: 0,
          bookNumbers: 0,
          sets: 0,
          qty: 0,
          unitPrice: 0,
          result: 0
        },
        papers: [],
        gathering: {
          selected: false,
          qty: 0,
          unitPrice: 0,
          result: 0
        },
        binding: {
          selected: false,
          type: null,
          template: null,
          qty: 0,
          unitPrice: 0,
          result: 0
        }
      };
    }
    
    // Ensure sub-objects exist
    if (!billBook.details) {
      billBook.details = {
        billNumbers: 0,
        bookNumbers: 0,
        sets: 0,
        qty: 0,
        unitPrice: 0,
        result: 0
      };
    }
    
    if (!billBook.gathering) {
      billBook.gathering = {
        selected: false,
        qty: 0,
        unitPrice: 0,
        result: 0
      };
    }
    
    if (!billBook.binding) {
      billBook.binding = {
        selected: false,
        type: null,
        template: null,
        qty: 0,
        unitPrice: 0,
        result: 0
      };
    }
    
    if (!billBook.papers) {
      billBook.papers = [];
    }
    
    // Set defaults for any missing properties
    const numberOfPapers = billBook.numberOfPapers || 0;
    const billNumbers = billBook.details?.billNumbers || 0;
    const bookNumbers = billBook.details?.bookNumbers || 0;
    const sets = billBook.details?.sets || 0;
    const qty = billBook.details?.qty || 0;
    const unitPrice = billBook.details?.unitPrice || 0;
    const result = billBook.details?.result || 0;
    
    const gatheringSelected = billBook.gathering?.selected || false;
    const gatheringQty = billBook.gathering?.qty || 0;
    const gatheringUnitPrice = billBook.gathering?.unitPrice || 0;
    const gatheringResult = billBook.gathering?.result || 0;
    
    const bindingSelected = billBook.binding?.selected || false;
    const bindingType = billBook.binding?.type || null;
    const bindingTemplate = billBook.binding?.template || null;
    const bindingQty = billBook.binding?.qty || 0;
    const bindingUnitPrice = billBook.binding?.unitPrice || 0;
    const bindingResult = billBook.binding?.result || 0;
    
    console.log('Inserting bill book with values:', {
      offsetJobId,
      numberOfPapers,
      billNumbers,
      bookNumbers,
      sets,
      qty,
      unitPrice,
      result,
      gatheringSelected,
      gatheringQty,
      gatheringUnitPrice,
      gatheringResult,
      bindingSelected,
      bindingType,
      bindingTemplate,
      bindingQty,
      bindingUnitPrice,
      bindingResult
    });
    
    // 1. Insert main bill book record
    const result1 = await query<any>(
      `INSERT INTO offset_job_bill_books (
        offset_job_id, number_of_papers, bill_numbers, book_numbers, sets, qty, unit_price, result,
        gathering_selected, gathering_qty, gathering_unit_price, gathering_result,
        binding_selected, binding_type, binding_template, binding_qty, binding_unit_price, binding_result
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        offsetJobId,
        numberOfPapers,
        billNumbers,
        bookNumbers,
        sets,
        qty,
        unitPrice,
        result,
        gatheringSelected,
        gatheringQty,
        gatheringUnitPrice,
        gatheringResult,
        bindingSelected,
        bindingType,
        bindingTemplate,
        bindingQty,
        bindingUnitPrice,
        bindingResult
      ]
    );
    
    const billBookId = result1.insertId;
    
    // 2. Insert bill book papers and their colors
    if (billBook.papers && billBook.papers.length > 0) {
      for (let i = 0; i < billBook.papers.length; i++) {
        const paper = billBook.papers[i];
        
        if (!paper) continue;
        
        const paperType = paper.paperType || '';
        
        // Insert paper
        const paperResult = await query<any>(
          'INSERT INTO offset_job_bill_book_papers (bill_book_id, paper_index, paper_type) VALUES (?, ?, ?)',
          [billBookId, i, paperType]
        );
        
        const paperId = paperResult.insertId;
        
        // Insert paper colors
        if (paper.colors && paper.colors.length > 0) {
          for (const color of paper.colors) {
            if (!color) continue;
            
            await query(
              'INSERT INTO offset_job_bill_book_paper_colors (bill_book_paper_id, color_name) VALUES (?, ?)',
              [paperId, color]
            );
          }
        }
      }
    }
  } catch (error) {
    console.error('Error saving offset job bill book:', error);
    throw error;
  }
}

// Save material supply details
async function saveOffsetJobMaterialSupply(offsetJobId: number, materialSupply: OffsetPrintFormData['materialSupply']): Promise<void> {
  try {
    // Create default material supply object if not provided
    if (!materialSupply) {
      materialSupply = {
        supplier: 'shop',
        items: {}
      };
    }
    
    // Ensure items object exists
    if (!materialSupply.items) {
      materialSupply.items = {};
    }
    
    // Set defaults for any missing properties
    const supplier = materialSupply.supplier || 'shop';
    
    console.log('Inserting material supply with values:', {
      offsetJobId,
      supplier,
      itemCount: Object.keys(materialSupply.items).length
    });
    
    // 1. Insert main material supply record
    const result = await query<any>(
      'INSERT INTO offset_job_material_supply (offset_job_id, default_supplier) VALUES (?, ?)',
      [offsetJobId, supplier]
    );
    
    const materialSupplyId = result.insertId;
    
    // 2. Insert material supply items
    const items = materialSupply.items;
    for (const [itemName, itemData] of Object.entries(items)) {
      if (!itemData) continue;
      
      const itemSupplier = itemData.supplier || 'shop';
      const supplierName = itemData.supplierName || null;
      
      await query(
        'INSERT INTO offset_job_material_supply_items (material_supply_id, material_name, supplier, supplier_name) VALUES (?, ?, ?, ?)',
        [materialSupplyId, itemName, itemSupplier, supplierName]
      );
    }
  } catch (error) {
    console.error('Error saving offset job material supply:', error);
    throw error;
  }
}

// Get a single offset print job
export async function getOffsetPrintJob(id: number): Promise<OffsetPrintJob | null> {
  try {
    // Get the main job record
    const jobs = await query<OffsetPrintJob[]>(
      'SELECT * FROM offset_print_jobs WHERE id = ?',
      [id]
    );
    
    if (jobs.length === 0) {
      return null;
    }
    
    return jobs[0];
  } catch (error) {
    console.error('Error getting offset print job:', error);
    return null;
  }
}

// Update an offset print job status
export async function updateOffsetPrintJobStatus(id: number, status: OffsetPrintJob['status']): Promise<boolean> {
  try {
    const result = await query<any>(
      'UPDATE offset_print_jobs SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating offset print job status:', error);
    return false;
  }
}

// List all offset print jobs with basic info
export async function listOffsetPrintJobs(options: {
  limit?: number;
  offset?: number;
  status?: OffsetPrintJob['status'];
  customerId?: number;
} = {}): Promise<{ jobs: OffsetPrintJob[]; total: number }> {
  try {
    const { limit = 50, offset = 0, status, customerId } = options;
    
    // Build the WHERE clause
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (customerId) {
      conditions.push('customer_id = ?');
      params.push(customerId);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get jobs with pagination
    const jobs = await query<OffsetPrintJob[]>(
      `SELECT * FROM offset_print_jobs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    // Get total count
    const countResult = await query<[{ total: number }]>(
      `SELECT COUNT(*) as total FROM offset_print_jobs ${whereClause}`,
      params
    );
    
    return {
      jobs,
      total: countResult[0].total
    };
  } catch (error) {
    console.error('Error listing offset print jobs:', error);
    return { jobs: [], total: 0 };
  }
}

// Delete an offset print job
export async function deleteOffsetPrintJob(id: number): Promise<boolean> {
  try {
    // Due to foreign key constraints with ON DELETE CASCADE,
    // deleting the main record will delete all related records
    const result = await query<any>(
      'DELETE FROM offset_print_jobs WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting offset print job:', error);
    return false;
  }
} 