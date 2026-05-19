-- ============================================
-- OZY Studio Inspection System
-- Complete Database Schema (Multi-tenant SaaS)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Companies (公司表 - 多租戶)
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- 基本資訊
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  logo_url TEXT,
  
  -- LINE 集成
  line_channel_id VARCHAR(255),
  line_channel_secret VARCHAR(255),
  line_notify_token VARCHAR(255),
  
  -- Notion 集成
  notion_api_key VARCHAR(255),
  notion_database_id VARCHAR(255),
  
  -- 訂閱資訊
  subscription_plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  subscription_status VARCHAR(50) DEFAULT 'active',
  subscription_end_date TIMESTAMP,
  
  -- 審計
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_subscription_plan CHECK (subscription_plan IN ('free', 'pro', 'enterprise'))
);

-- ============================================
-- 2. Users (使用者表)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 認證
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  
  -- 基本資訊
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(20),
  
  -- 角色權限
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- admin, designer, contractor, client
  permissions JSONB DEFAULT '{}',
  
  -- LINE 集成
  line_user_id VARCHAR(255),
  
  -- 狀態
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  
  -- 審計
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_role CHECK (role IN ('admin', 'designer', 'contractor', 'client'))
);

-- ============================================
-- 3. Projects (驗收案件表)
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 案件編號（自動生成）
  project_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- 基本資訊
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'planning', -- planning, in_progress, completed, signed
  
  -- 客戶資訊
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  client_email VARCHAR(255),
  client_address TEXT,
  
  -- 驗收資訊
  inspection_date DATE,
  inspection_location TEXT,
  inspector_name VARCHAR(255),
  
  -- 工程類型
  project_type VARCHAR(100), -- residential, commercial, renovation, etc.
  
  -- 統計資訊（自動計算）
  total_items INT DEFAULT 0,
  total_defects INT DEFAULT 0,
  completed_defects INT DEFAULT 0,
  overdue_defects INT DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  
  -- Notion 集成
  notion_page_id VARCHAR(255),
  
  -- 簽名與報告
  owner_signature_id UUID,
  designer_signature_id UUID,
  report_id UUID,
  
  -- 狀態
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- 審計
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('planning', 'in_progress', 'completed', 'signed'))
);

-- ============================================
-- 4. Project Items (工程項目表)
-- ============================================
CREATE TABLE project_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 項目資訊
  name VARCHAR(255) NOT NULL, -- 木作、油漆、系統櫃等
  description TEXT,
  quantity INT DEFAULT 1,
  unit VARCHAR(50), -- 項、m2、m、etc.
  
  -- 指派資訊
  assigned_contractor VARCHAR(255),
  assigned_user_id UUID REFERENCES users(id),
  
  -- 狀態
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
  
  -- 統計
  total_defects INT DEFAULT 0,
  completed_defects INT DEFAULT 0,
  
  -- 審計
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed'))
);

-- ============================================
-- 5. Defects (缺失記錄表 - 核心)
-- ============================================
CREATE TABLE defects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  project_item_id UUID REFERENCES project_items(id),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 缺失資訊
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- 優先度與期限
  priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  due_date DATE,
  is_overdue BOOLEAN DEFAULT FALSE, -- 自動計算
  
  -- 指派
  assigned_to VARCHAR(255),
  assigned_user_id UUID REFERENCES users(id),
  
  -- 狀態
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, verified
  status_updated_at TIMESTAMP,
  
  -- 統計
  photos_count INT DEFAULT 0,
  
  -- LINE 通知
  line_message_id VARCHAR(255),
  line_notified_at TIMESTAMP,
  
  -- Notion 集成
  notion_page_id VARCHAR(255),
  
  -- 審計
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'verified'))
);

-- ============================================
-- 6. Defect Photos (缺失照片表)
-- ============================================
CREATE TABLE defect_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  defect_id UUID NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 照片資訊
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(50),
  
  -- 排序
  sort_order INT DEFAULT 0,
  
  -- 審計
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_mime_type CHECK (mime_type LIKE 'image/%')
);

-- ============================================
-- 7. Signatures (電子簽名表)
-- ============================================
CREATE TABLE signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 簽名資訊
  signer_type VARCHAR(50) NOT NULL, -- owner, designer, contractor
  signer_name VARCHAR(255) NOT NULL,
  signer_email VARCHAR(255),
  signer_phone VARCHAR(20),
  
  -- 簽名圖片
  signature_image_path VARCHAR(500),
  signature_data TEXT, -- Canvas 簽名資料
  
  -- 狀態
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- 審計
  signed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_signer_type CHECK (signer_type IN ('owner', 'designer', 'contractor'))
);

-- ============================================
-- 8. Reports (驗收報告表)
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 報告資訊
  report_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  
  -- 內容
  pdf_file_path VARCHAR(500),
  pdf_file_size INT,
  
  -- 版本控制
  version INT DEFAULT 1,
  is_latest BOOLEAN DEFAULT TRUE,
  
  -- 模板
  template_type VARCHAR(50) DEFAULT 'standard', -- standard, detailed, minimal
  
  -- 狀態
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, generated, sent, signed
  
  -- 審計
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('draft', 'generated', 'sent', 'signed'))
);

-- ============================================
-- 9. LINE Notifications (LINE 通知隊列)
-- ============================================
CREATE TABLE line_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 通知資訊
  event_type VARCHAR(100) NOT NULL, -- defect_created, status_changed, overdue_alert, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- 目標
  recipient_line_user_id VARCHAR(255),
  recipient_user_id UUID REFERENCES users(id),
  
  -- 關聯
  defect_id UUID REFERENCES defects(id),
  project_id UUID REFERENCES projects(id),
  
  -- 狀態
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMP,
  error_message TEXT,
  
  -- 審計
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- ============================================
-- 10. Notion Sync Logs (Notion 同步日誌)
-- ============================================
CREATE TABLE notion_sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 同步資訊
  entity_type VARCHAR(100) NOT NULL, -- project, defect, etc.
  entity_id UUID NOT NULL,
  operation VARCHAR(50) NOT NULL, -- create, update, delete
  
  -- Notion
  notion_page_id VARCHAR(255),
  
  -- 狀態
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, synced, failed
  error_message TEXT,
  
  -- 審計
  synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'synced', 'failed'))
);

-- ============================================
-- 11. Audit Logs (審計日誌)
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- 操作資訊
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  
  -- 變更
  old_values JSONB,
  new_values JSONB,
  
  -- 審計
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Indexes (索引優化)
-- ============================================

-- Companies
CREATE INDEX idx_companies_slug ON companies(slug);

-- Users
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_line_user_id ON users(line_user_id);

-- Projects
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_project_number ON projects(project_number);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Project Items
CREATE INDEX idx_project_items_project_id ON project_items(project_id);
CREATE INDEX idx_project_items_company_id ON project_items(company_id);
CREATE INDEX idx_project_items_status ON project_items(status);

-- Defects (核心查詢優化)
CREATE INDEX idx_defects_project_id ON defects(project_id);
CREATE INDEX idx_defects_company_id ON defects(company_id);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_defects_priority ON defects(priority);
CREATE INDEX idx_defects_is_overdue ON defects(is_overdue);
CREATE INDEX idx_defects_due_date ON defects(due_date);
CREATE INDEX idx_defects_assigned_user_id ON defects(assigned_user_id);
CREATE INDEX idx_defects_created_at ON defects(created_at);

-- Defect Photos
CREATE INDEX idx_defect_photos_defect_id ON defect_photos(defect_id);
CREATE INDEX idx_defect_photos_company_id ON defect_photos(company_id);

-- Signatures
CREATE INDEX idx_signatures_project_id ON signatures(project_id);
CREATE INDEX idx_signatures_company_id ON signatures(company_id);

-- Reports
CREATE INDEX idx_reports_project_id ON reports(project_id);
CREATE INDEX idx_reports_company_id ON reports(company_id);
CREATE INDEX idx_reports_status ON reports(status);

-- LINE Notifications
CREATE INDEX idx_line_notifications_company_id ON line_notifications(company_id);
CREATE INDEX idx_line_notifications_status ON line_notifications(status);
CREATE INDEX idx_line_notifications_defect_id ON line_notifications(defect_id);

-- Notion Sync Logs
CREATE INDEX idx_notion_sync_logs_company_id ON notion_sync_logs(company_id);
CREATE INDEX idx_notion_sync_logs_status ON notion_sync_logs(status);

-- Audit Logs
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- Triggers (自動觸發器)
-- ============================================

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_items_updated_at
BEFORE UPDATE ON project_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_defects_updated_at
BEFORE UPDATE ON defects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 自動判斷逾期
CREATE OR REPLACE FUNCTION check_defect_overdue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date < CURRENT_DATE AND NEW.status != 'completed' THEN
    NEW.is_overdue = TRUE;
  ELSE
    NEW.is_overdue = FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_defect_overdue_insert
BEFORE INSERT ON defects
FOR EACH ROW
EXECUTE FUNCTION check_defect_overdue();

CREATE TRIGGER check_defect_overdue_update
BEFORE UPDATE ON defects
FOR EACH ROW
EXECUTE FUNCTION check_defect_overdue();

-- 自動計算完成率
CREATE OR REPLACE FUNCTION update_project_completion_rate()
RETURNS TRIGGER AS $$
DECLARE
  total_defects INT;
  completed_defects INT;
BEGIN
  SELECT COUNT(*) INTO total_defects FROM defects WHERE project_id = NEW.project_id;
  SELECT COUNT(*) INTO completed_defects FROM defects WHERE project_id = NEW.project_id AND status = 'completed';
  
  UPDATE projects
  SET 
    total_defects = total_defects,
    completed_defects = completed_defects,
    completion_rate = CASE WHEN total_defects > 0 THEN (completed_defects::DECIMAL / total_defects) * 100 ELSE 0 END
  WHERE id = NEW.project_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_stats_after_defect_insert
AFTER INSERT ON defects
FOR EACH ROW
EXECUTE FUNCTION update_project_completion_rate();

CREATE TRIGGER update_project_stats_after_defect_update
AFTER UPDATE ON defects
FOR EACH ROW
EXECUTE FUNCTION update_project_completion_rate();

-- ============================================
-- Row Level Security (RLS - 多租戶隔離)
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE defect_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 基礎 RLS 策略（需要在 Supabase 中設定認證後完善）
-- 這裡提供範本，實際部署時需根據 auth.users 表調整

-- ============================================
-- 完成
-- ============================================
-- Schema 建立完成
-- 預留欄位已包含：LINE、Notion、簽名、PDF、多公司隔離
-- 所有核心功能都已預設支援
