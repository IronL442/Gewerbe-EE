import boto3
import os
import uuid
import tempfile
from botocore.exceptions import ClientError
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class R2StorageService:
    def __init__(self):
        """Initialize R2 storage service with credentials from environment"""
        self.endpoint_url = os.getenv('R2_ENDPOINT_URL')
        self.access_key_id = os.getenv('R2_ACCESS_KEY_ID')
        self.secret_access_key = os.getenv('R2_SECRET_ACCESS_KEY')
        self.bucket_name = os.getenv('R2_BUCKET_NAME')
        
        if not all([self.endpoint_url, self.access_key_id, self.secret_access_key, self.bucket_name]):
            logger.warning("R2 credentials not found, falling back to local storage")
            self.s3_client = None
            return
        
        try:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key,
                region_name='auto'  # R2 uses 'auto' for region
            )
            logger.info("R2 storage service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize R2 storage: {e}")
            self.s3_client = None
    
    def is_available(self) -> bool:
        """Check if R2 storage is available"""
        return self.s3_client is not None
    
    def upload_file(self, file_data: bytes, file_name: str, content_type: str = 'application/octet-stream') -> Optional[str]:
        """
        Upload file to R2 storage
        
        Args:
            file_data: File content as bytes
            file_name: Name for the file in storage
            content_type: MIME type of the file
            
        Returns:
            File URL if successful, None if failed
        """
        if not self.is_available():
            logger.warning("R2 storage not available")
            return None
        
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_name,
                Body=file_data,
                ContentType=content_type,
                ACL='private'  # Keep files private
            )
            
            # Return the file URL (for internal use)
            file_url = f"{self.endpoint_url}/{self.bucket_name}/{file_name}"
            logger.info(f"File uploaded successfully: {file_name}")
            return file_url
            
        except ClientError as e:
            logger.error(f"Failed to upload file to R2: {e}")
            return None
    
    def download_file(self, file_name: str) -> Optional[bytes]:
        """
        Download file from R2 storage
        
        Args:
            file_name: Name of the file in storage
            
        Returns:
            File content as bytes if successful, None if failed
        """
        if not self.is_available():
            return None
        
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=file_name)
            return response['Body'].read()
        except ClientError as e:
            logger.error(f"Failed to download file from R2: {e}")
            return None
    
    def delete_file(self, file_name: str) -> bool:
        """
        Delete file from R2 storage
        
        Args:
            file_name: Name of the file to delete
            
        Returns:
            True if successful, False if failed
        """
        if not self.is_available():
            return False
        
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_name)
            logger.info(f"File deleted successfully: {file_name}")
            return True
        except ClientError as e:
            logger.error(f"Failed to delete file from R2: {e}")
            return False
    
    def generate_presigned_url(self, file_name: str, expiration: int = 3600) -> Optional[str]:
        """
        Generate a presigned URL for file access
        
        Args:
            file_name: Name of the file
            expiration: URL expiration time in seconds (default 1 hour)
            
        Returns:
            Presigned URL if successful, None if failed
        """
        if not self.is_available():
            return None
        
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_name},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            return None

    def file_exists(self, file_name: str) -> bool:
        """
        Check if a file exists in R2 storage
        
        Args:
            file_name: Name of the file to check
            
        Returns:
            True if file exists, False otherwise
        """
        if not self.is_available():
            return False
        
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=file_name)
            return True
        except ClientError:
            return False

# Global instance
r2_storage = R2StorageService()